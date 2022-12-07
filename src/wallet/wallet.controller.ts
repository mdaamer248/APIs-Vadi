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
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InvestorGuard } from 'src/guards/investor.guard';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Get('create/wallet')
  async createEthAccount(@Request() req) {
    const response = await this.walletService.createAccount(req.token.email);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Get('get/balances')
  async getEthBalance(@Request() req) {
    const response = await this.walletService.getCoinBalance(req.token.email);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Get('check-existance-of-wallet/:email')
  async checkExistance(@Request() req) {
    const isWalletExist = await this.walletService.isWalletExists(
      req.token.email,
    );
    return isWalletExist;
  }

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Get('get-wallet')
  async getWalletByEmail(@Request() req) {
    const wallet = await this.walletService.getWalletByEmail(req.token.email);
    return wallet;
  }
}
