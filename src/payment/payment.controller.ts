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
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Post('/create/order')
  async create(@Body() payment: CreatePaymentDto) {
  const orderId = await this.paymentService.createOrder(payment.amount);
    return orderId;
  }

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Post('capture/:orderID')
  async captureOrder(@Request() req, @Param('orderID') orderID: string) {
    const tsx = await this.paymentService.capturePayment(orderID,req.token.email);
    return tsx;
  }
}
