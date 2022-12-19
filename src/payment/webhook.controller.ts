import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Header,
  Body,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebHookService } from './webhook.service';

@ApiTags('Hook')
@Controller('webhook')
export class WebhookController {
  constructor(private webHookService: WebHookService) {}
  @Post('/order/completion')
  @HttpCode(200)
 async  handleWebhook(@Body() body: any) {
    if (body.event_type == 'CHECKOUT.ORDER.APPROVED') {
      return await this.webHookService.checkoutOrderApproved(body);
    }
    if (body.event_type == 'PAYMENT.CAPTURE.COMPLETED') {
      return await this.webHookService.paymentCaptureCompleted(body);
    }
  }

  //////////// Verify Signatures
  //  handleWebhook(
  //   @Header('paypal-transmission-id','tranmissionId') transmissionId: string,
  //   @Body() body: any,
  //   @Header('paypal-transmission-sig','signature') signature: string,
  // ) {
  //   return this.webHookService.orderCompletionStatus(transmissionId, body, signature);
  // }
}
