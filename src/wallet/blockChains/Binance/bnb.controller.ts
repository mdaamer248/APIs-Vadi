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
  import { BnbService } from './bnb.service';
  import { InvestorGuard } from 'src/guards/investor.guard';
  
  @ApiTags('Binance Test-Network (BNB)')
  @Controller('bnb')
  export class BnbController {
    constructor(
      private readonly bnbService: BnbService
    ) {}

    @ApiBearerAuth()
    @UseGuards(InvestorGuard)
    @Post('send/bnb')
    async sendEth(@Request() req, @Body() sendEthDto: SendCoinDto){
      const tsx = await this.bnbService.sendBnb(req.token.email, sendEthDto);
      return tsx;
    }
  
  }
  