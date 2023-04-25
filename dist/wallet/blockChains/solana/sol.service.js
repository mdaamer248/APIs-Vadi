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
exports.SolService = void 0;
const common_1 = require("@nestjs/common");
const wallet_service_1 = require("../../wallet.service");
const multichainWallet = require('multichain-crypto-wallet');
let SolService = class SolService {
    constructor(walletService) {
        this.walletService = walletService;
    }
    async sendSol(email, sendSolDto) {
        const wallet = await this.walletService.getWalletByEmail(email);
        const transfer = await multichainWallet.transfer({
            recipientAddress: sendSolDto.address,
            amount: sendSolDto.amount,
            network: 'solana',
            rpcUrl: 'https://api.devnet.solana.com',
            privateKey: wallet.solPrivateKey,
        });
        return transfer;
    }
};
SolService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [wallet_service_1.WalletService])
], SolService);
exports.SolService = SolService;
//# sourceMappingURL=sol.service.js.map