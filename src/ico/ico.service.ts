import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const multichainWallet = require('multichain-crypto-wallet');
const Web3 = require('web3');

export class ICOService {
  web3: any;
  constructor(
    private configService: ConfigService,
  ) {
    this.web3 = new Web3(
      'https://eth-goerli.g.alchemy.com/v2/G9aSmHyq0pCXRyGxOeC93wEDoxNiHCSj',
    );
  }

  async claimCoins(tsxHash: string, eth_address: string) {
    let tokenRecieved;
    let tsx_hash;
    const details = await this.web3.eth.getTransactionReceipt(tsxHash);

    // Checking the tsx hash belongs to transfer function or not
    if (
      details.logs[0].topics[0] !=
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ) {
      throw new HttpException(
        'Transaction hash is not of Transfer Function',
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log('0x' +
    this.web3.utils.stripHexPrefix(details.logs[0].topics[2]).slice(24));
    

    // checking is the reciever is vadiVault or not
    if (
      '0x' +
        this.web3.utils.stripHexPrefix(details.logs[0].topics[2]).slice(24) !=
      this.configService.get<string>("VADIVAULT_ADDRESS")
    ) {
      throw new HttpException(
        'The recieving address is not ours.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Checking is the sender is the correct
    if (
      '0x' +
        this.web3.utils.stripHexPrefix(details.logs[0].topics[1]).slice(24) !=
      eth_address
    ) {
      throw new HttpException('You are not the sender', HttpStatus.BAD_REQUEST);
    }

    // Checking which token we got
    // a) USDC
    if (details.to == this.configService.get<string>('USDC_ADDRESS')) {
      tokenRecieved =
        this.web3.utils.hexToNumberString(details.logs[0].data) / 10 ** 3;
         // divide by  10 ** decimal

         tsx_hash = await this.transferVadiCoins(eth_address, tokenRecieved)
    }

    return tsx_hash;
  }

  async transferVadiCoins(address, amount) {
    // Transferring ERC20 tokens from one address to another.
    const transfer = await multichainWallet.transfer({
      recipientAddress: address,
      amount: amount,
      network: 'ethereum',
      rpcUrl: this.configService.get<string>('GOERLI_RPC'),
      privateKey: this.configService.get<string>('ADMIN_PRIVATE_KEY'),
      gasPrice: '100', // Gas price is in Gwei. leave empty to use default gas price
      tokenAddress: this.configService.get<string>(
        'VADI_COIN_TRANSPARENT_CONTRACT_ADDRESS',
      ),
    });

    return transfer;
  }
}
