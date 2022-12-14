import { Controller, Post, HttpCode, HttpStatus, Header, Body, Request} from '@nestjs/common';
import { WebHookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
    constructor(private webHookService: WebHookService){}
  @Post('/order/completion')
  @HttpCode(200)
  //  handleWebhook(
  //   @Header('paypal-transmission-id','tranmissionId') transmissionId: string,
  //   @Body() body: any,
  //   @Header('paypal-transmission-sig','signature') signature: string,
  // ) {
  //   return this.webHookService.orderCompletionStatus(transmissionId, body, signature);
  // }
  handleWebhook(@Request() req, @Body() body: any) {
    // return this.webHookService.orderCompletionStatus(transmissionId, body, signature);
    console.log(req)

  }
    
}
