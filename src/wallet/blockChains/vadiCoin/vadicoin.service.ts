import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { SendCoinDto } from 'src/wallet/dto/send-coin.dto';
import { InvestorService } from 'src/investor/investor.service';

import { MtcController } from '../polygon/mtc.controller';
import { WalletService } from 'src/wallet/wallet.service';
const multichainWallet = require('multichain-crypto-wallet');

@Injectable()
export class VdcService {
  constructor(
    private configService: ConfigService,
    private walletService: WalletService
  ) {}

  /// Send Vadi Coin
  async sendVadiCoin(email: string, sendVdcDto: SendCoinDto) {
    const wallet= await this.walletService.getWalletByEmail(email);

  
    // Transferring ERC20 tokens from one address to another.
    const transfer = await multichainWallet.transfer({
      recipientAddress: sendVdcDto.address,
      amount: sendVdcDto.amount,
      network: 'ethereum',
      rpcUrl: this.configService.get<string>('GOERLI_RPC'),
      privateKey: wallet.ethPrivateKey,
      gasPrice: '100', // Gas price is in Gwei. leave empty to use default gas price
      tokenAddress: '0x089797d601E7973278e62008bEbE693cA060A396',
    });

    return transfer;
  }

  //// Purchasing VadiCoin
  async purchaseVadiCoin(email: string, amount: number) {
    const wallet= await this.walletService.getWalletByEmail(email);
    
    // Transferring ERC20 tokens from one address to another.
    const transfer = await multichainWallet.transfer({
      recipientAddress: wallet.ethPublicKey,
      amount: amount,
      network: 'ethereum',
      rpcUrl: this.configService.get<string>('GOERLI_RPC'),
      privateKey: this.configService.get<string>('ADMIN_PRIVATE_KEY'),
      gasPrice: '100', // Gas price is in Gwei. leave empty to use default gas price
      tokenAddress: '0x089797d601E7973278e62008bEbE693cA060A396',
    });

    return transfer;
  }
}
