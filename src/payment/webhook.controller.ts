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
  handleWebhook(@Body() body: any) {
    // return this.webHookService.orderCompletionStatus(transmissionId, body, signature);
    let orderId;
    let orderAmount;
    let orderCurrency;

    if (body.event_type == 'CHECKOUT.ORDER.COMPLETED'){
      return this.webHookService.checkoutOrderCompletion(body);
    }
    if (body.event_type == 'PAYMENT.CAPTURE.COMPLETED') {
      orderId = body.resource.supplementary_data.related_ids.order_id;
      orderAmount = body.resource.amount.value;
      orderCurrency = body.resource.amount.currency_code;

      console.log(
        `Order ${orderId} for amount ${orderAmount} ${orderCurrency} completed`,
      );
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
