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
const multichainWallet = require('multichain-crypto-wallet');
const Web3 = require('web3');

@Injectable()
export class ICOService {
  web3: any;
  constructor(
    @InjectRepository(HotWalletICO)
    private icoTsxsRepository: Repository<HotWalletICO>,
    @InjectRepository(PayPalIcoPayment)
    private payPalRepository: Repository<PayPalIcoPayment>,
    private configService: ConfigService,
  ) {
    this.web3 = new Web3(
      'https://eth-goerli.g.alchemy.com/v2/G9aSmHyq0pCXRyGxOeC93wEDoxNiHCSj',
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

    // checking is the reciever is vadiVault or not
    if (
      '0x' +
        this.web3.utils
          .stripHexPrefix(details.logs[0].topics[2])
          .slice(24)
          .toLowerCase() !=
      '0x0dEc5A633dD6f91084Bc257f80BA29a4e9ed1Bb0'.toLocaleLowerCase()
    ) {
      throw new HttpException(
        'The recieving address is not ours.',
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
      '0x1a0304acDB077F9d7e0D082a5a1aCE5F4d3b9B51'.toLowerCase()
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

  async transferVadiCoins(address, amount) {
    // Transferring ERC20 tokens from one address to another.
    const transfer = await multichainWallet.transfer({
      recipientAddress: address,
      amount: amount,
      network: 'ethereum',
      rpcUrl: this.configService.get<string>('GOERLI_RPC'),
      privateKey: this.configService.get<string>('ADMIN_PRIVATE_KEY'),
      gasPrice: '100', // Gas price is in Gwei. leave empty to use default gas price
      tokenAddress: this.configService.get<string>(
        'VADI_COIN_TRANSPARENT_CONTRACT_ADDRESS',
      ),
    });

    return transfer.hash;
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

  // For ETH
  async ethToVadiCoin(tsx_hash: string) {
    const [tsx] = await this.icoTsxsRepository.find({
      where: {
        recieved_token_tsx_hash: tsx_hash,
      },
    });

    if ( tsx && tsx.tsx_status == 'Completed')
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

    const ethAmount = parseFloat(details.value) / 10 ** 18;

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
      url: `https://api-goerli.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${hash}&apikey=${this.configService.get<string>(
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

  ///////////// Paypal Methods

  //////////////////////////  use the orders api to create an order //////////////////////////
  async createOrder(amount: string) {
    const accessToken = await this.generateAccessToken();
    const url = `${this.configService.get<string>('BASE')}/v2/checkout/orders`;
    const body = JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'MXN',
            value: amount,
          },
        },
      ],
    });

    const config = {
      method: 'post',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
        Authorization: `Bearer ${accessToken}`,
      },
      data: body,
    };

    const orderID = await axios(config)
      .then((res) => {
        return res.data.id;
      })
      .catch((error) => console.log(error.res.data));

    await this.createPayment({ order_id: orderID });

    return { orderID };
  }

  // use the orders api to capture payment for an order
  async capturePayment(orderId: string) {
    const accessToken = await this.generateAccessToken();
    const url = `${this.configService.get<string>(
      'BASE',
    )}/v2/checkout/orders/${orderId}/capture`;

    const config = {
      method: 'post',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const res = await axios(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    return res;
  }

  // generate an access token using client id and app secret
  async generateAccessToken() {
    const auth = Buffer.from(
      this.configService.get<string>('CLIENT_ID') +
        ':' +
        this.configService.get<string>('APP_SECRET'),
    ).toString('base64');

    const config = {
      url: `${this.configService.get<string>('BASE')}/v1/oauth2/token`,
      method: 'post',
      data: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    };
    const access_token = await axios(config)
      .then((res) => {
        return res.data.access_token;
      })
      .catch((e) => console.log(e));
    return access_token;
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
}
