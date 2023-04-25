import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { loadavg } from 'os';
import { NotFoundError } from 'rxjs';
import { Repository } from 'typeorm';
import { CreatePayPalPaymentDto } from './dto/create-paypal-payment.dto';
import { CreateHotWalletICODTO } from './dto/ico-tsx.dto';
import { UpdateHotWalletICODTO } from './dto/update-ico-tsx.dto';
import { UpdatePayPalPaymentDto } from './dto/update-paypal-payment.dto';
import { HotWalletICO } from './entity/hot-wallet.ico.entity';
import { PayPalIcoPayment } from './entity/paypal-ico.entity';
const Web3 = require('web3');
const ABI = require('../../abi.json');

@Injectable()
export class ICOService {
  web3: any;
  account: any;
  contract: any;
  constructor(
    @InjectRepository(HotWalletICO)
    private icoTsxsRepository: Repository<HotWalletICO>,
    @InjectRepository(PayPalIcoPayment)
    private payPalRepository: Repository<PayPalIcoPayment>,
    private configService: ConfigService,
  ) {
    this.web3 = new Web3(this.configService.get<string>('MAINNET_RPC'));

    this.web3.eth.accounts.wallet.add(
      this.configService.get<string>('TREASURER_PRIVATE_KEY'),
    );
    this.account = this.web3.eth.accounts.wallet[0];
    this.contract = new this.web3.eth.Contract(
      ABI,
      this.configService.get<string>('VADI_COIN_TRANSPARENT_CONTRACT_ADDRESS'),
    );
  }

  async claimCoins(tsxHash: string, eth_address: string) {
    let tokenRecieved: number;
    let tsx_hash;
    const details = await this.web3.eth.getTransactionReceipt(tsxHash);
    // console.log(details);

    // Checking the tsx hash belongs to transfer function or not
    if (
      details.logs[0].topics[0] !=
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' // keccak hash of transfer function
    ) {
      throw new HttpException(
        'Transaction hash is not of Transfer Function',
        HttpStatus.BAD_REQUEST,
      );
    }

    // checking is the reciever is vadiVault Owner or not
    if (
      '0x' +
        this.web3.utils
          .stripHexPrefix(details.logs[0].topics[2])
          .slice(24)
          .toLowerCase() !=
      this.configService.get<string>('VADIVAULT_ADDRESS').toLocaleLowerCase()
    ) {
      throw new HttpException(
        'The recieving address does not belong to vadiVault Owner.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Checking is the sender is the correct
    if (
      '0x' +
        this.web3.utils
          .stripHexPrefix(details.logs[0].topics[1])
          .slice(24)
          .toLowerCase() !=
      eth_address.toLowerCase()
    ) {
      throw new HttpException(
        'This transaction hash does not belongs to you',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Checking which token we got
    // a) USDC ( use USDC contract address )
    if (
      details.to.toLowerCase() ==
      this.configService.get<string>('USDC_ADDRESS').toLowerCase()
    ) {
      const [transaction] = await this.icoTsxsRepository.find({
        where: {
          recieved_token_tsx_hash: tsxHash,
        },
      });

      if (transaction && transaction.tsx_status == 'Completed') {
        throw new HttpException(
          'Vadi Coins are already claimed for this TSX Hash',
          HttpStatus.BAD_REQUEST,
        );
      }
      tokenRecieved =
        this.web3.utils.hexToNumberString(details.logs[0].data) / 10 ** 6;
      // divide by  10 ** decimal

      tsx_hash = await this.transferVadiCoins(eth_address, 20 * tokenRecieved);
      const status = await this.checkTransactionStatus(tsx_hash);
      if (status == '"1"') {
        const icoTsx = {
          recieved_token_tsx_hash: tsxHash,
          recieved_token_amount: tokenRecieved,
          users_eth_address: eth_address,
          recieved_token_name: 'USDC',
          tsx_status: 'Completed',
          vadi_coin_amount: 20 * tokenRecieved,
          vadi_coins_transfered: true,
          vadi_coin_transfer_tsx_hash: tsx_hash,
        };

        await this.createTsx(icoTsx);
      }

      return tsx_hash;
    }
  }

  /// Calling Contract Method Transfer for sending coins
  async transferVadiCoins(address: string, amount: number) {
    const transfer = await this.contract.methods
      .transfer(address, Math.floor(amount))
      .send({
        from: this.account.address,
        gas: 490000,
        gasPrice: 80000000000,
      });

    return transfer.transactionHash;
  }

  async issueTokens(amountPaid: string, order_id: string) {
    const vadi_coin_amount: string = amountPaid.toString();
    const orderInfo = await this.getPaymentByOrderId(order_id);
    const tsx = await this.transferVadiCoins(
      orderInfo.eth_address,
      parseFloat(vadi_coin_amount),
    );

    const tokenTransferStatus: string = await this.checkTransactionStatus(tsx);

    if (tokenTransferStatus == '"1"') {
      await this.updatePayment({
        order_id,
        vadi_coin_amount,
        vadi_coin_transfered: true,
        vadi_coin_transfer_tsx_hash: tsx,
      });
      return tsx;
    }

    return tsx;
  }

  ///////// For ETH

  // previous version function
  async ethToVadiCoin(tsx_hash: string) {
    const [tsx] = await this.icoTsxsRepository.find({
      where: {
        recieved_token_tsx_hash: tsx_hash,
      },
    });

    if (tsx && tsx.tsx_status == 'Completed')
      throw new HttpException(
        'Tokens are already claimed for this Transaction hash.',
        HttpStatus.BAD_REQUEST,
      );
    const details = await this.web3.eth.getTransaction(tsx_hash);
    if (
      details.to.toLocaleLowerCase() !=
      '0x089797d601E7973278e62008bEbE693cA060A396'.toLocaleLowerCase()
    )
      throw new HttpException(
        'Etherium was not send to vadi coin address',
        HttpStatus.BAD_REQUEST,
      );

    const ethAmount = this.web3.utils.fromWei(details.value, 'ether');

    const ethPriceInMxn = await axios
      .get(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=mxn',
      )
      .then((res) => {
        return res.data.ethereum.mxn;
      })
      .catch((e) => {
        console.log(e.data.result);
      });

    const hash = await this.transferVadiCoins(
      details.from,
      ethAmount * ethPriceInMxn,
    );

    // Checking transaction status
    const tokenTransferStatus: string = await this.checkTransactionStatus(hash);
    if (tokenTransferStatus == '"1"') {
      await this.createTsx({
        recieved_token_amount: ethAmount,
        recieved_token_name: 'ETH',
        recieved_token_tsx_hash: tsx_hash,
        tsx_status: 'Completed',
        vadi_coins_transfered: true,
        vadi_coin_transfer_tsx_hash: hash,
        vadi_coin_amount: ethAmount * ethPriceInMxn,
        users_eth_address: details.from,
      });
    }
    return hash;
  }

  // updated version function
  async ethTsxUpdate(tsx_hash: string) {
    const [tsx] = await this.icoTsxsRepository.find({
      where: {
        recieved_token_tsx_hash: tsx_hash,
      },
    });

    if (tsx && tsx.tsx_status == 'Completed')
      throw new HttpException(
        'Tokens are already claimed for this Transaction hash.',
        HttpStatus.BAD_REQUEST,
      );
    const details = await this.web3.eth.getTransactionReceipt(tsx_hash);
    const ethDetails = await this.web3.eth.getTransaction(tsx_hash);

    const vadi_coins_transfered =
      this.web3.utils.hexToNumber(details.logs[0].data) / 10 ** 8;

    if (
      details.to.toLocaleLowerCase() !=
      this.configService
        .get<string>('VADI_COIN_TRANSPARENT_CONTRACT_ADDRESS')
        .toLocaleLowerCase()
    )
      throw new HttpException(
        'Etherium was not send to Vadi smart contract.',
        HttpStatus.BAD_REQUEST,
      );

    const ethAmount = this.web3.utils.fromWei(ethDetails.value, 'ether');

    await this.createTsx({
      recieved_token_amount: ethAmount,
      recieved_token_name: 'ETH',
      recieved_token_tsx_hash: tsx_hash,
      tsx_status: 'Completed',
      vadi_coins_transfered: true,
      vadi_coin_transfer_tsx_hash: tsx_hash,
      vadi_coin_amount: vadi_coins_transfered,
      users_eth_address: details.from,
    });

    return {
      tsx_hash,
      tsx_status: 'Completed',
    };
  }

  //// Repository Methods

  // Record Transactions
  async createTsx(createIcoTsx: CreateHotWalletICODTO) {
    const recieved_token_tsx_hash = createIcoTsx.recieved_token_tsx_hash;

    const [tsx] = await this.icoTsxsRepository.find({
      where: {
        recieved_token_tsx_hash,
      },
    });

    if (tsx)
      throw new HttpException('Duplicate Hash Found', HttpStatus.BAD_REQUEST);

    const transaction = await this.icoTsxsRepository.create(createIcoTsx);
    const savedTsx = await this.icoTsxsRepository.save(transaction);
    return savedTsx;
  }

  // Update Transaction
  async updateTsx(updateTsxDto: UpdateHotWalletICODTO) {
    const tsx = await this.findByRecievedTsxHash(
      updateTsxDto.recieved_token_tsx_hash,
    );
    const keys = Object.keys(updateTsxDto);
    keys.forEach((key) => {
      tsx[key] = updateTsxDto[key];
    });

    const savedTsx = await this.icoTsxsRepository.save(tsx);
    return savedTsx;
  }

  // Find by recieved transaction hash
  async findByRecievedTsxHash(hash: string) {
    const [tsx] = await this.icoTsxsRepository.find({
      where: {
        recieved_token_tsx_hash: hash,
      },
    });

    if (!tsx) throw new NotFoundException('ICO Tsx does not exists.');
    return tsx;
  }

  ///// BlockChain Transaction
  // Check Transaction status
  async checkTransactionStatus(hash: string) {
    const config = {
      method: 'get',
      url: `https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${hash}&apikey=${this.configService.get<string>(
        'ETHERSCAN_API_KEY',
      )}`,
      headers: {},
    };

    const status = await axios(config)
      .then(function (response) {
        return JSON.stringify(response.data.status);
      })
      .catch(function (error) {
        console.log(' gvfgsd;vj', error);
      });

    let value: string;
    if (typeof status == 'string') value = status;

    return value;
  }

  /// Repository Methods for Paypal Payment
  ///////// Repository Methods

  // Create Payments
  async createPayment(createPaymentDto: CreatePayPalPaymentDto) {
    const payment = await this.payPalRepository.create(createPaymentDto);
    await this.payPalRepository.save(payment);
    return payment;
  }

  // Get payment info by order_id
  async getPaymentByOrderId(order_id: string) {
    const [paymentInfo] = await this.payPalRepository.find({
      where: { order_id },
    });
    if (!paymentInfo)
      throw new NotFoundException(
        'Payment reciept with this orderId is not found.',
      );
    return paymentInfo;
  }

  // Fetch all payment methods
  async getAllPayments() {
    const payments = await this.payPalRepository.find();
    return payments;
  }

  async updatePayment(updatePaymentDto: UpdatePayPalPaymentDto) {
    const payment = await this.getPaymentByOrderId(updatePaymentDto.order_id);
    if (!payment) throw new NotFoundException('Payment does not exists');
    const keys = Object.keys(updatePaymentDto);
    keys.forEach((key) => {
      payment[key] = updatePaymentDto[key];
    });

    await this.payPalRepository.save(payment);
    return payment;
  }

  async savePayment(payment: PayPalIcoPayment) {
    const updatedPayment = await this.payPalRepository.save(payment);
    return updatedPayment;
  }
}
