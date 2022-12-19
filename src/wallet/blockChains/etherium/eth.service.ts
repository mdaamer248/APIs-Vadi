import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { SendCoinDto } from 'src/wallet/dto/send-coin.dto';
import { WalletService } from 'src/wallet/wallet.service';
const multichainWallet = require('multichain-crypto-wallet');

@Injectable()
export class EthService {
  constructor(
    private walletService: WalletService,
    private configService: ConfigService,
  ) {}

  async sendEth(email: string, sendEthDto: SendCoinDto) {
   

    const wallet= await this.walletService.getWalletByEmail(email);


    // Transferring ETH from one address to another.
    const transfer = await multichainWallet.transfer({
      recipientAddress: sendEthDto.address,
      amount: sendEthDto.amount,
      network: 'ethereum',
      rpcUrl: this.configService.get<string>('GOERLI_RPC'),
      privateKey: wallet.ethPrivateKey,
      gasPrice: '10000', // Gas price is in Gwei. Leave empty to use default gas price
      data: 'Money for transportation', // Send a message
    });

    return transfer;
  }
}
