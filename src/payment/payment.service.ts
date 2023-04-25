import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvestorService } from 'src/investor/investor.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import axios from 'axios';
import { VdcService } from 'src/wallet/blockChains/vadiCoin/vadicoin.service';
import { Pay } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HotPay } from './entities/hotpayment.entity';
import { CreateHotPayDto } from './dto/create-hot-pay.dto';
import { UpdateHotPayDto } from './dto/update-hot-pay.dto';
const multichainWallet = require('multichain-crypto-wallet');
const Web3 = require('web3');

@Injectable()
export class PaymentService {
  web3: any;
  constructor(
    @InjectRepository(Pay) private paymentRepository: Repository<Pay>,
    @InjectRepository(HotPay) private hotPayRepository: Repository<HotPay>,
    private investorService: InvestorService,
    private configService: ConfigService,
    private vdcService: VdcService,
  ) {
    ///// Connection to web3
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(
        this.configService.get<string>('GOERLI_RPC'),
      ),
    );
  }

  //////////////////////////  use the orders api to create an order //////////////////////////
  async createOrder(amount: string, user_email: string) {
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

    const payment = await this.createPayment({ order_id: orderID, user_email });

    return { orderID };
  }

  // use the orders api to capture payment for an order
  async capturePayment(orderId: string, email: string) {
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

  ///////// Repository Methods

  // Create Payments
  async createPayment(createPaymentDto: CreatePaymentDto) {
    const payment = await this.paymentRepository.create(createPaymentDto);
    await this.paymentRepository.save(payment);
    return payment;
  }

  // Get payment info by order_id
  async getPaymentByOrderId(order_id: string) {
    const [paymentInfo] = await this.paymentRepository.find({
      where: { order_id },
    });
    return paymentInfo;
  }

  // Fetch all payment methods
  async getAllPayments() {
    const payments = await this.paymentRepository.find();
    return payments;
  }

  async updatePayment(updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.getPaymentByOrderId(updatePaymentDto.order_id);
    if (!payment) throw new NotFoundException('Payment does not exists');
    const keys = Object.keys(updatePaymentDto);
    keys.forEach((key) => {
      payment[key] = updatePaymentDto[key];
    });

    await this.paymentRepository.save(payment);
    return payment;
  }

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

  //// Issue Tokens
  async issueTokens(amountPaid: string, order_id: string, email: string) {
    const tokens_amount: string = amountPaid.toString();
    const tsx = await this.vdcService.purchaseVadiCoin(
      email,
      parseInt(amountPaid),
    );
    const tokenTranferStatus: string = await this.checkTransactionStatus(
      tsx.hash,
    );
    let updatedTsx;
    if (tokenTranferStatus == '"1"') {
      updatedTsx = await this.updatePayment({
        order_id,
        tokens_amount,
        tokens_transfered: true,
        transaction_hash: tsx.hash,
      });
    }

    return updatedTsx;
  }

  //// Create Hot Wallet Order
  async createHotWalletOrder(email: string) {
    const investor = await this.investorService.findByEmail(email);
    return { eth_address: investor.wallet.ethPublicKey };
  }

  /// Claim Vadi Coins
  async claimVadiCoins(email: string, senderAddress: string) {
    const investor = await this.investorService.findByEmail(email);
    const tsxs = await this.verifyTransaction(
      investor.wallet.ethPublicKey,
      senderAddress,
      email,
    );

    const setteledTsx = await this.handlePendingTransaction(tsxs, email);
    return setteledTsx;
  }

  /// Verify Transaction  returns valid pending transactions
  async verifyTransaction(
    vadi_address: string,
    from: string,
    user_email: string,
  ) {
    const tsxs = await axios
      .get(
        `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${vadi_address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${this.configService.get<string>(
          'ETHERSCAN_API_KEY',
        )}`,
      )
      .then(function (response) {
        return response.data.result;
      })
      .catch(function (error) {
        console.log(error);
      });

    // Filtering valid transactions
    const recordedTsxs = await this.hotPayRepository.find({
      where: { user_email },
    });
    let recordedHashes = [];
    if (recordedTsxs.length != 0) {
      recordedHashes = recordedTsxs.map((tsx) => tsx.recieved_tsx_hash);
    }

    const res = tsxs.filter((tsx) => {
      if (
        tsx.to == vadi_address.toLocaleLowerCase() &&
        tsx.from == from.toLocaleLowerCase() &&
        tsx.txreceipt_status == 1 &&
        !recordedHashes.includes(tsx.hash)
      ) {
        return true;
      }
    });

    res.forEach(async (tsx) => {
      const savedTsx = await this.createHotPay({
        user_email,
        amount: tsx.value,
        recieved_tsx_hash: tsx.hash,
        vadi_address,
        from,
        status: 'incomplete',
      });
    });
    return res;
  }

  /// Handle pending transactions
  async handlePendingTransaction(tsxs: any[], email: string) {
    const tsxHandeled = tsxs.map(async (tsx) => {
      const transac = await this.vdcService.purchaseVadiCoin(email, 2);
      const tokenTranferStatus: string = await this.checkTransactionStatus(
        transac.hash,
      );

      if (tokenTranferStatus == '"1"') {
        const updatedTsx = await this.updateHotPay({
          recieved_tsx_hash: tsx.hash,
          tokens_transfered: true,
          transaction_hash: transac.hash,
          status: 'completed',
          tokens_amount: '2',
        });
      }
      console.log(transac.hash);

      return transac.hash;
    });

    return tsxHandeled;
  }

  //// Create Hot Payment
  async createHotPay(createHotPayDto: CreateHotPayDto) {
    const hotPay = this.hotPayRepository.create(createHotPayDto);
    await this.hotPayRepository.save(hotPay);
    return hotPay;
  }

  /// Update Hot Payment
  async updateHotPay(updateHotPayDto: UpdateHotPayDto) {
    const [hotPay] = await this.hotPayRepository.find({
      where: { recieved_tsx_hash: updateHotPayDto.recieved_tsx_hash },
    });
    if (hotPay) {
      const keys = Object.keys(updateHotPayDto);
      keys.forEach((key) => {
        hotPay[key] = updateHotPayDto[key];
      });
      await this.hotPayRepository.save(hotPay);
      return hotPay;
    }
  }

  /// Exchange to Vadi Coins
  async exchangeToVdcCoins(email: string, amount: string) {
    const investor = await this.investorService.findByEmail(email);
    const ethCoinBalance = await multichainWallet.getBalance({
      address: investor.wallet.ethPublicKey,
      network: 'ethereum',
      rpcUrl: this.configService.get<string>('GOERLI_RPC'),
    });

    if (ethCoinBalance.balance <= parseFloat(amount))
      return { message: 'Insufficient Balance' };
    const exchangeAmount = ethCoinBalance.balance - parseFloat(amount);
    console.log(exchangeAmount);

    this.web3.eth.accounts.wallet.clear();
    this.web3.eth.accounts.wallet.add(investor.wallet.ethPrivateKey);

    const tsx = await this.web3.eth.sendTransaction({
      from: investor.wallet.ethPublicKey,
      to: '0x0dEc5A633dD6f91084Bc257f80BA29a4e9ed1Bb0',
      value: this.web3.utils.toWei(amount, 'ether'),
      gas: 50000,
    });

    if (!tsx.status) return { message: 'Transaction failed', tsx };

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

    const transac = await this.vdcService.purchaseVadiCoin(email, ethPriceInMxn * parseFloat(amount));
    return transac.hash;
  }
}
