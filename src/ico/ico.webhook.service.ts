import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InvestorService } from 'src/investor/investor.service';
import * as crypto from 'crypto';
import { ICOService } from './ico.service';

@Injectable()
export class ICOWebHookService {
  constructor(
    private icoService: ICOService,
  ) {}

  //// Checkout order approved status
  async checkoutOrderApproved(body: any) {
    const order_id: string = body.resource.id;
    const payer_name: string =
      body.resource.payer.name.given_name +
      ' ' +
      body.resource.payer.name.surname;

    const payer_email: string = body.resource.payer.email_address;
    const status: string = body.resource.status;
    await this.icoService.updatePayment({
      order_id,
      payer_email,
      payer_name,
      status,
    });

    return 'Payment has been updated';
  }

  //// Payment Capture
  async paymentCaptureCompleted(body: any) {
    const order_id = body.resource.supplementary_data.related_ids.order_id;
    const currency = body.resource.amount.currency_code;
    const gross_amount =
      body.resource.seller_receivable_breakdown.gross_amount.value;
    const net_amount =
      body.resource.seller_receivable_breakdown.net_amount.value;
    const paypal_fee =
      body.resource.seller_receivable_breakdown.paypal_fee.value;

    const updatedPayment = await this.icoService.updatePayment({
      order_id,
      currency,
      gross_amount,
      net_amount,
      paypal_fee,
    });

    const transferUpdate = await this.icoService.issueTokens(net_amount,order_id);
    return 'Payment has been updated';
  }


  // Submit Eth Address
  async submitEthAddress(order_id: string, eth_address: string){
    const updatedPayment = await this.icoService.updatePayment({order_id, eth_address});
    return updatedPayment;
  }
}
