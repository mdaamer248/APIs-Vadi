import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SendCoinDto } from 'src/wallet/dto/send-coin.dto';
import { InvestorGuard } from 'src/guards/investor.guard';
import { BtcService } from './btc.service';

@ApiTags('Bitcoin')
@Controller('btc')
export class BtcController {
  constructor(private readonly btcService: BtcService) {}

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Post('send/btc')
  async sendEth(@Request() req, @Body() sendBtcDto: SendCoinDto) {
    const tsx = await this.btcService.sendBtc(req.token.email, sendBtcDto);
    return tsx;
  }
}
