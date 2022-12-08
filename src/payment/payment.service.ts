import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvestorService } from 'src/investor/investor.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import axios from 'axios';
import { VdcService } from 'src/wallet/blockChains/vadiCoin/vadicoin.service';

@Injectable()
export class PaymentService {
  constructor(
    private investorService: InvestorService,
    private configService: ConfigService,
    private vdcService: VdcService,
  ) {}

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
    const amountPaid = res.purchase_units[0].payments.captures[0].amount.value;
    await this.vdcService.purchaseVadiCoin(email, parseInt(amountPaid));

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


}
