import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { APP_FILTER } from '@nestjs/core';
import { InvestorGuard } from 'src/guards/investor.guard';
import { MakePaymentDto } from './dto/make-payment.dto';
import { HotWalletPaymentDto } from './dto/hot-wallet-payment.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Post('/create/order')
  async create(@Request() req,@Body() payment: MakePaymentDto) {
  const orderId = await this.paymentService.createOrder(payment.amount, req.token.email);
    return orderId;
  }

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Post('capture/:orderID')
  async captureOrder(@Request() req, @Param('orderID') orderID: string) {
    const tsx = await this.paymentService.capturePayment(orderID,req.token.email);
    return tsx;
  }

  @Get('get-all-payments')
  async getAllpayments(){
    const payments = await this.paymentService.getAllPayments();
    return payments;
  }

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Post('/hot-wallet-pay')
  async createHotWalletPayment(@Request() req) {
  const publicKey = await this.paymentService.createHotWalletOrder(req.token.email);
  return publicKey;
  }

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Post('/claim-vadi-coin')
  async claimVadiCoins(@Request() req, @Body() hotWalletPaymentDto: HotWalletPaymentDto) {
  const res = await this.paymentService.claimVadiCoins(req.token.email, hotWalletPaymentDto.metamask_address);
  return res;
  }
}
