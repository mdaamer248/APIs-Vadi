import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InvestorService } from 'src/investor/investor.service';
import * as crypto from 'crypto';
import { ICOService } from './ico.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PayPalService } from './paypal.service';
import { defaultThrottleConfig } from 'rxjs/internal/operators/throttle';

@Injectable()
export class ICOWebHookService {
  constructor(
    private icoService: ICOService,
    private paypalService: PayPalService,
  ) {}

  //// Checkout order approved status
  async checkoutOrderApproved(body: any) {
    const order_id: string = body.resource.id;
    // const payer_name: string =
    //   body.resource.payer.name.given_name +
    //   ' ' +
    //   body.resource.payer.name.surname;

    // const payer_email: string = body.resource.payer.email_address;
    const status: string = body.resource.status;
    const orderInfo = await this.icoService.getPaymentByOrderId(order_id);
    if (orderInfo.status !== 'COMPLETED') {
      orderInfo.status = status;
      await this.icoService.savePayment(orderInfo);
      return 'Payment has been updated';
    }

    return 'Payment is already been confirmed.';
  }

  //// Payment Capture
  async paymentCaptureCompleted(body: any) {
    const order_id = body.resource.supplementary_data.related_ids.order_id;
    const net_amount =
      body.resource.seller_receivable_breakdown.net_amount.value;
    // const currency = body.resource.amount.currency_code;
    // const gross_amount =
    //   body.resource.seller_receivable_breakdown.gross_amount.value;
    // const paypal_fee =
    //   body.resource.seller_receivable_breakdown.paypal_fee.value;

    const orderInfo = await this.icoService.getPaymentByOrderId(order_id);
    if (!orderInfo.net_amount) {
      orderInfo.status = net_amount;
      await this.icoService.savePayment(orderInfo);
      return 'Payment has been updated';
    }

    return 'Payment already has net amount with it.';
  }

  // Submit Eth Address
  async submitEthAddress(order_id: string, eth_address: string) {
    const updatedPayment = await this.icoService.updatePayment({
      order_id,
      eth_address,
    });
    return updatedPayment;
  }

  // Claim Vadi Coins
  async issueVadiCoins(orderId: string) {
    let hash;
    const orderInfo = await this.icoService.getPaymentByOrderId(orderId);
    if (!orderInfo.eth_address)
      return new HttpException(
        'Submit your eth address first before claiming coins.',
        HttpStatus.EXPECTATION_FAILED,
      );
    if (orderInfo.vadi_coin_transfered)
      return new HttpException(
        'Claimed for this orderId has already been made.',
        HttpStatus.EXPECTATION_FAILED,
      );
    if (orderInfo.status !== 'COMPLETED') {
      const data = await this.paypalService.getOrderDetailsById(orderId);
      orderInfo.status = data.status;
      await this.icoService.savePayment(orderInfo);
    }
    if (orderInfo.net_amount) {
      hash = await this.icoService.issueTokens(orderInfo.net_amount, orderId);
      return hash;
    }

    return new HttpException(
      'Paypal Have not confirmed your payment yet. Try after some time, with the OrderId.',
      HttpStatus.EXPECTATION_FAILED,
    );
  }

  //// Get Orderdetails by orderId
  async getOrderDetailsById(orderId: string) {
    const details = await this.paypalService.getOrderDetailsById(orderId);
    return details;
  }
}
