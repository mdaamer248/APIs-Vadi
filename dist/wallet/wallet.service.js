"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const investor_service_1 = require("../investor/investor.service");
const typeorm_2 = require("typeorm");
const wallet_entity_1 = require("./entities/wallet.entity");
const multichainWallet = require('multichain-crypto-wallet');
let WalletService = class WalletService {
    constructor(walletRepository, investorService, configService) {
        this.walletRepository = walletRepository;
        this.investorService = investorService;
        this.configService = configService;
    }
    async createAccount(email) {
        const [investor] = await this.investorService.find(email);
        const ethWallet = multichainWallet.createWallet({
            derivationPath: "m/44'/60'/0'/0/0",
            network: 'ethereum',
        });
        const solWallet = multichainWallet.createWallet({
            derivationPath: "m/44'/501'/0'/0'",
            network: 'solana',
        });
        const btcWallet = multichainWallet.createWallet({
            derivationPath: "m/44'/0'/0'/0/0",
            network: 'bitcoin',
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
    async getWalletByEmail(email) {
        const wallets = await this.walletRepository.find({ relations: ['investor'] });
        const investorEmail = email;
        let wallet;
        wallets.forEach((wall) => {
            if (wall.investor && wall.investor.email == investorEmail)
                wallet = wall;
        });
        return wallet;
    }
    async getCoinBalance(email) {
        const investor = await this.investorService.findByEmail(email);
        if (!investor)
            throw new common_1.HttpException('Register first to create account', common_1.HttpStatus.BAD_REQUEST);
        const wallet = await this.getWalletByEmail(email);
        const vadiCoinBalance = await multichainWallet.getBalance({
            address: wallet.ethPublicKey,
            network: 'ethereum',
            rpcUrl: this.configService.get('GOERLI_RPC'),
            tokenAddress: '0x089797d601E7973278e62008bEbE693cA060A396',
        });
        const bnbCoinBalance = await multichainWallet.getBalance({
            address: wallet.ethPublicKey,
            network: 'ethereum',
            rpcUrl: this.configService.get('BNB_RPC'),
        });
        const ethCoinBalance = await multichainWallet.getBalance({
            address: wallet.ethPublicKey,
            network: 'ethereum',
            rpcUrl: this.configService.get('GOERLI_RPC'),
        });
        const maticCoinBalance = await multichainWallet.getBalance({
            address: wallet.ethPublicKey,
            network: 'ethereum',
            rpcUrl: this.configService.get('MATIC_RPC'),
        });
        const solCoinBalance = await multichainWallet.getBalance({
            address: wallet.solPublicKey,
            network: 'solana',
            rpcUrl: 'https://api.devnet.solana.com',
        });
        const balances = [
            {
                name: 'Etherium',
                symbol: 'ETH',
                image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
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
                image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850',
                balance: bnbCoinBalance,
            },
            {
                name: 'Matic',
                symbol: 'MATIC',
                image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
                balance: maticCoinBalance,
            },
            {
                name: 'Solana',
                symbol: 'SOL',
                image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422',
                balance: solCoinBalance,
            },
        ];
        return balances;
    }
    async isWalletExists(email) {
        const wallet = await this.getWalletByEmail(email);
        if (!wallet.ethPrivateKey)
            return false;
        return true;
    }
};
WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        investor_service_1.InvestorService,
        config_1.ConfigService])
], WalletService);
exports.WalletService = WalletService;
//# sourceMappingURL=wallet.service.js.map