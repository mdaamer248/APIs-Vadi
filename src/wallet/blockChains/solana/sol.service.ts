import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SendCoinDto } from 'src/wallet/dto/send-coin.dto';
import { InvestorService } from 'src/investor/investor.service';
import { WalletService } from 'src/wallet/wallet.service';
const multichainWallet = require('multichain-crypto-wallet');

@Injectable()
export class SolService {
  constructor(private walletService: WalletService) {}
  async sendSol(email: string, sendSolDto: SendCoinDto) {
    const wallet= await this.walletService.getWalletByEmail(email);

   
    const transfer = await multichainWallet.transfer({
      recipientAddress: sendSolDto.address,
      amount: sendSolDto.amount,
      network: 'solana',
      rpcUrl: 'https://api.devnet.solana.com',
      privateKey: wallet.solPrivateKey,
    });

    return transfer;
  }
}
