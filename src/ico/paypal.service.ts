import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ICOService } from './ico.service';

@Injectable()
export class PayPalService {
  constructor(
    private configService: ConfigService,
    private icoService: ICOService,
  ) {}

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

    await this.icoService.createPayment({ order_id: orderID });
    console.log('OrderId  ->', orderID);
    return { orderID };
  }

  // use the orders api to capture payment for an order
  async capturePayment(orderId: string) {
    const accessToken = await this.generateAccessToken();
    const orderInfo = await this.icoService.getPaymentByOrderId(orderId);
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
        console.log(JSON.stringify(response.data));
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    orderInfo.net_amount =
      res.purchase_units[0].payments.captures[0].seller_receivable_breakdown.net_amount.value;
    orderInfo.gross_amount =
      res.purchase_units[0].payments.captures[0].seller_receivable_breakdown.gross_amount.value;
    orderInfo.paypal_fee =
      res.purchase_units[0].payments.captures[0].seller_receivable_breakdown.paypal_fee.value;
    orderInfo.currency =
      res.purchase_units[0].payments.captures[0].seller_receivable_breakdown.net_amount.currency_code;
    orderInfo.payer_name =
      res.payment_source.paypal.name.given_name +
      ' ' +
      res.payment_source.paypal.name.surname;
    orderInfo.payer_email = res.payment_source.paypal.email_address;
    orderInfo.status = res.purchase_units[0].payments.captures[0].status;
    await this.icoService.savePayment(orderInfo);
    return res;
  }

  // get order details by order_id
  async getOrderDetailsById(orderId: string) {
    const accessToken = await this.generateAccessToken();
    const url = `${this.configService.get<string>(
      'BASE',
    )}/v2/checkout/orders/${orderId}`;

    const config = {
      method: 'get',
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
}
