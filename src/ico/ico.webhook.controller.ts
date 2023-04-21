import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Header,
  Body,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubmitICOEthAddressDTO } from './dto/submit-ico-eth-address.dto';
import { ICOWebHookService } from './ico.webhook.service';

@ApiTags('ICO/WEBHOOK')
@Controller('ico/webhook')
export class ICOWebhookController {
  constructor(private webHookService: ICOWebHookService) {}
  @Post('/order/completion')
  @HttpCode(200)
  async handleWebhook(@Body() body: any) {
    console.log(JSON.stringify(body));
    if (body.event_type == 'CHECKOUT.ORDER.APPROVED') {
      return await this.webHookService.checkoutOrderApproved(body);
    }
    if (body.event_type == 'PAYMENT.CAPTURE.COMPLETED') {
      return await this.webHookService.paymentCaptureCompleted(body);
    }
  }

  @Post('/submit-eth-address')
  async submitEthAddress(@Body() body: SubmitICOEthAddressDTO) {
    const payment = await this.webHookService.submitEthAddress(
      body.payPalOrderId,
      body.ethAddress,
    );
    return payment;
  }

  @Get('claim/vadi-coins/:orderId')
  async claimVadiCoinsByOrderId(@Param('orderId') orderId: string) {
    const tsx_hash = await this.webHookService.issueVadiCoins(orderId);
    return tsx_hash;
  }
}
