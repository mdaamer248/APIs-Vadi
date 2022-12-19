import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { InvestorService } from 'src/investor/investor.service';
import { Repository } from 'typeorm';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';
const multichainWallet = require('multichain-crypto-wallet');

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    private investorService: InvestorService,
    private configService: ConfigService,
  ) {}

  async createAccount(email: string) {
    const [investor] = await this.investorService.find(email);
  
    // Creating an Ethereum wallet.
    const ethWallet = multichainWallet.createWallet({
      derivationPath: "m/44'/60'/0'/0/0",
      network: 'ethereum',
    });

    // Creating a Solana wallet.
    const solWallet = multichainWallet.createWallet({
      derivationPath: "m/44'/501'/0'/0'", // Leave empty to use default derivation path
      network: 'solana',
    });

    // Creating a Bitcoin wallet.
    const btcWallet = multichainWallet.createWallet({
      derivationPath: "m/44'/0'/0'/0/0", // Leave empty to use default derivation path
      network: 'bitcoin', // 'bitcoin' or 'bitcoin-testnet'
    });

    const wallet = {
      investor,
      ethMnemonic: ethWallet.mnemonic,
      ethPublicKey: ethWallet.address,
      ethPrivateKey: ethWallet.privateKey,

      solMnemonic: solWallet.mnemonic,
      solPublicKey: solWallet.address,
      solPrivateKey: solWallet.privateKey,

      btcMnemonic: btcWallet.mnemonic,
      btcPublicKey: btcWallet.address,
      btcPrivateKey: btcWallet.privateKey,
    };

    await this.walletRepository.create(wallet);
    const savedWallet = await this.walletRepository.save(wallet);

    return savedWallet;
  }


  ////// Get wallet by Email
  async getWalletByEmail(email: string) {
    const wallets = await this.walletRepository.find({relations:['investor']});
    const investorEmail = email;
    let wallet ;
    wallets.forEach((wall) => {
      if(wall.investor && wall.investor.email == investorEmail) wallet = wall;
    })
    return wallet;
  }

  ////// Get balances
  async getCoinBalance(email: string) {
    const investor = await this.investorService.findByEmail(email);
    if (!investor)
      throw new HttpException(
        'Register first to create account',
        HttpStatus.BAD_REQUEST,
      );

       const wallet= await this.getWalletByEmail(email);

    // Get the balance of an ERC20 token.
    const vadiCoinBalance = await multichainWallet.getBalance({
      address: wallet.ethPublicKey,
      network: 'ethereum',
      rpcUrl: this.configService.get<string>('GOERLI_RPC'),
      tokenAddress: '0x089797d601E7973278e62008bEbE693cA060A396',
    });

    // Get the BNB balance of an address.
    const bnbCoinBalance = await multichainWallet.getBalance({
      address: wallet.ethPublicKey,
      network: 'ethereum',
      rpcUrl: this.configService.get<string>('BNB_RPC'),
    });

    // Get the ETH balance of an address.
    const ethCoinBalance = await multichainWallet.getBalance({
      address: wallet.ethPublicKey,
      network: 'ethereum',
      rpcUrl: this.configService.get<string>('GOERLI_RPC'),
    });

    // Get the Matic balance of an address.
    const maticCoinBalance = await multichainWallet.getBalance({
      address: wallet.ethPublicKey,
      network: 'ethereum',
      rpcUrl: this.configService.get<string>('MATIC_RPC'),
    });

    // Get the SOL balance of an address.
    const solCoinBalance = await multichainWallet.getBalance({
      address: wallet.solPublicKey,
      network: 'solana',
      rpcUrl: 'https://api.devnet.solana.com',
    });

    const balances = [
      {
        name: 'Etherium',
        symbol: 'ETH',
        image:
          'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
        balance: ethCoinBalance,
      },
      {
        name: 'VadiCoin',
        symbol: 'VDC',
        image: 'https://i.ibb.co/cwv6kTC/vadiCoin.jpg',
        balance: vadiCoinBalance,
      },
      {
        name: 'BinanceCoin',
        symbol: 'BNB',
        image:
          'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850',
        balance: bnbCoinBalance,
      },
      {
        name: 'Matic',
        symbol: 'MATIC',
        image:
          'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
        balance: maticCoinBalance,
      },
      {
        name: 'Solana',
        symbol: 'SOL',
        image:
          'https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422',
        balance: solCoinBalance,
      },
    ];

    return balances;
  }

  async isWalletExists(email: string) {
    const wallet = await this.getWalletByEmail(email)

    if (!wallet.ethPrivateKey) return false;

    return true;
  }
}
