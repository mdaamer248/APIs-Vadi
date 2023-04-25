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
import { EthService } from './eth.service';
import { InvestorGuard } from 'src/guards/investor.guard';
import { SendCoinDto } from 'src/wallet/dto/send-coin.dto';

@ApiTags('Etherium (Goerli)')
@Controller('eth')
export class EthController {
  constructor(private readonly ethService: EthService) {}

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Post('send/eth')
  async sendEth(@Request() req, @Body() sendEthDto: SendCoinDto) {
    const tsx = await this.ethService.sendEth(req.token.email, sendEthDto);
    return tsx;
  }
}
