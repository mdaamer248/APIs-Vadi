import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SendCoinDto } from 'src/wallet/dto/send-coin.dto';
import { InvestorService } from 'src/investor/investor.service';
import { WalletService } from 'src/wallet/wallet.service';
const multichainWallet = require('multichain-crypto-wallet');

@Injectable()
export class BtcService {
  constructor(private walletService: WalletService) {}

  async sendBtc(email: string, sendBtcDto: SendCoinDto) {
    const wallet = await this.walletService.getWalletByEmail(email);

    // Transferring BTC from one address to another.
    const response = await multichainWallet.transfer({
      privateKey: wallet.btcPrivateKey,
      recipientAddress: sendBtcDto.address,
      amount: sendBtcDto.amount,
      network: 'bitcoin-testnet', // 'bitcoin' or 'bitcoin-testnet'
      fee: 10000, // Optional param default value is 10000
      subtractFee: false, // Optional param default value is false
    });

    return response;
  }
}
