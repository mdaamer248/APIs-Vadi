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
import { MtcService } from './mtc.service';

@ApiTags('Polygon Network (Mumbai)')
@Controller('mtc')
export class MtcController {
  constructor(private readonly mtcService: MtcService) {}

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Post('send/mtc')
  async sendEth(@Request() req, @Body() sendEthDto: SendCoinDto) {
    const tsx = await this.mtcService.sendMtc(req.token.email, sendEthDto);
    return tsx;
  }
}
