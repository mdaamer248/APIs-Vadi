import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InvestorService } from 'src/investor/investor.service';
import * as crypto from 'crypto';
import { PaymentService } from './payment.service';
import { SubmitEthAddressDTO } from './dto/submit-eth-address.dto';

@Injectable()
export class WebHookService {
  constructor(
    private paymentService: PaymentService,
  ) {}

  verifySignature(transmissionId: string, body: any, signature: string) {
    // Verify that the webhook is from PayPal
    let isVerified = false;
    if (transmissionId) {
      const verificationBodyJson = JSON.stringify(body);
      const verificationSeed = `${transmissionId}.${verificationBodyJson}`;
      const verificationSignatureBuffer = Buffer.from(signature, 'base64');
      const verificationSeedBuffer = Buffer.from(verificationSeed);
      const verificationHash = crypto
        .createHmac('sha256', process.env.WEBHOOK_SECRET)
        .update(verificationSeedBuffer)
        .digest('base64');

      const uint: Uint8Array = Buffer.from(verificationHash, 'base64');

      if (verificationSignatureBuffer.equals(uint)) {
        isVerified = true;
      }
    }
    return isVerified;
  }

  //// Checkout order approved status
  async checkoutOrderApproved(body: any) {
    const order_id: string = body.resource.id;
    const payer_name: string =
      body.resource.payer.name.given_name +
      ' ' +
      body.resource.payer.name.surname;

    const payer_email: string = body.resource.payer.email_address;
    const status: string = body.resource.status;
    await this.paymentService.updatePayment({
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

    const updatedPayment = await this.paymentService.updatePayment({
      order_id,
      currency,
      gross_amount,
      net_amount,
      paypal_fee,
    });

    const transferUpdate = await this.paymentService.issueTokens(net_amount,order_id,updatedPayment.user_email);
    return 'Payment has been updated';
  }


  // Submit Eth Address
  async submitEthAddress(order_id: string, eth_address: string){
    const updatedPayment = await this.paymentService.updatePayment({order_id, eth_address});
    return updatedPayment;
  }
}
