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
  import { VdcService } from './vadicoin.service';
import { Investor } from 'src/investor/entities/investor.entity';
  
  @ApiTags('VadiCoin')
  @Controller('vdc')
  export class VdcController {
    constructor(
      private readonly vdcService: VdcService
    ) {}
  
    
  
    @ApiBearerAuth()
    @UseGuards(InvestorGuard)
    @Post('send/vadicoin')
    async sendEth(@Request() req, @Body() sendVdcDto: SendCoinDto){
      const tsx = await this.vdcService.sendVadiCoin(req.token.email, sendVdcDto);
      return tsx;
    }


    @ApiBearerAuth()
    @UseGuards(InvestorGuard)
    @Get('purchase/vadicoin/:amount')
    async purchaseEth(@Request() req, @Param('amount') amount: number){
      const tsx = await this.vdcService.purchaseVadiCoin(req.token.email, amount);
      console.log(tsx)
      return tsx;
    }
  
  }
  