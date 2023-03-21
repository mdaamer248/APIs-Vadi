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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VdcService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const wallet_service_1 = require("../../wallet.service");
const multichainWallet = require('multichain-crypto-wallet');
let VdcService = class VdcService {
    constructor(configService, walletService) {
        this.configService = configService;
        this.walletService = walletService;
    }
    async sendVadiCoin(email, sendVdcDto) {
        const wallet = await this.walletService.getWalletByEmail(email);
        const transfer = await multichainWallet.transfer({
            recipientAddress: sendVdcDto.address,
            amount: sendVdcDto.amount,
            network: 'ethereum',
            rpcUrl: this.configService.get('GOERLI_RPC'),
            privateKey: wallet.ethPrivateKey,
            gasPrice: '100',
            tokenAddress: '0x089797d601E7973278e62008bEbE693cA060A396',
        });
        return transfer;
    }
    async purchaseVadiCoin(email, amount) {
        const wallet = await this.walletService.getWalletByEmail(email);
        const transfer = await multichainWallet.transfer({
            recipientAddress: wallet.ethPublicKey,
            amount: amount,
            network: 'ethereum',
            rpcUrl: this.configService.get('GOERLI_RPC'),
            privateKey: this.configService.get('ADMIN_PRIVATE_KEY'),
            gasPrice: '100',
            tokenAddress: '0x089797d601E7973278e62008bEbE693cA060A396',
        });
        return transfer;
    }
};
VdcService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        wallet_service_1.WalletService])
], VdcService);
exports.VdcService = VdcService;
//# sourceMappingURL=vadicoin.service.js.map