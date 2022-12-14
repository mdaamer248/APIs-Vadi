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
}
