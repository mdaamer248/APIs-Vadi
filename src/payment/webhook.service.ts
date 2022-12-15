import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InvestorService } from 'src/investor/investor.service';
import * as crypto from 'crypto';

@Injectable()
export class WebHookService {
  constructor(private investoService: InvestorService) {}

  orderCompletionStatus(transmissionId: string, body: any, signature: string) {
    const isVerified = this.verifySignature(transmissionId, body, signature);
    let orderId;
    let orderAmount;
    let orderCurrency;
    if (isVerified) {
      // Handle the webhook
      const eventType = body.event_type;
      if (eventType === 'PAYMENT.SALE.COMPLETED') {
        // Get the order details from the webhook payload
        orderId = body.resource.parent_payment;
        orderAmount = body.resource.amount.total;
        orderCurrency = body.resource.amount.currency;

        // Process the order completion
        this.processOrderCompletion(orderId, orderAmount, orderCurrency);
      }
    } else {
      // Send an error response to PayPal
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return { orderId, orderAmount };
  }

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

  processOrderCompletion(
    orderId: string,
    orderAmount: number,
    orderCurrency: string,
  ) {
    // Do something with the order details
    console.log(
      `Order ${orderId} for amount ${orderAmount} ${orderCurrency} completed`,
    );
  }

  //// Checkout order completion status
  checkoutOrderCompletion(body: any) {
    const gross_amount = body.resource.gross_amount.value;
    const net_amount =
      body.resource.purchase_units[0].payments.captures[0]
        .seller_receivable_breakdown.net_amount.value;
    const currency_code = body.resource.gross_amount.currency_code;
    const payer_name =
      body.resource.payer.name.given_name +
      '' +
      body.resource.payer.name.surname;

    const email = body.resource.payer.email_address;
    const status = body.resource.status;

    console.log(
      `${payer_name} is the payer with email ${email}. ${gross_amount} is the gross amount and ${net_amount} is the net amount ${currency_code}. The status of transaction is ${status}`,
    );
  }
}
