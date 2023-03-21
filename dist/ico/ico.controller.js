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
exports.ICOController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const claim_coin_dto_1 = require("./dto/claim-coin.dto");
const payment_amount_dto_1 = require("./dto/payment-amount.dto");
const ico_service_1 = require("./ico.service");
let ICOController = class ICOController {
    constructor(icoService) {
        this.icoService = icoService;
    }
    async claimVadiCoins(body) {
        const tsx_hash = await this.icoService.claimCoins(body.transaction_hash, body.eth_address);
        return tsx_hash;
    }
    async claimVadiCoinsByEth(tsx_hash) {
        const hash = await this.icoService.ethTsxUpdate(tsx_hash);
        return hash;
    }
    async create(amount) {
        const orderId = await this.icoService.createOrder(amount.amount);
        return orderId;
    }
    async captureOrder(orderID) {
        const tsx = await this.icoService.capturePayment(orderID);
        return tsx;
    }
};
__decorate([
    (0, common_1.Post)('/claim/vadi-coins'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [claim_coin_dto_1.ClaimCoinDTO]),
    __metadata("design:returntype", Promise)
], ICOController.prototype, "claimVadiCoins", null);
__decorate([
    (0, common_1.Get)('/claim/vadi-coins/by-eth/:tsx_hash'),
    __param(0, (0, common_1.Param)('tsx_hash')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ICOController.prototype, "claimVadiCoinsByEth", null);
__decorate([
    (0, common_1.Post)('/create/order'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_amount_dto_1.PaymentAmountDto]),
    __metadata("design:returntype", Promise)
], ICOController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('capture/:orderID'),
    __param(0, (0, common_1.Param)('orderID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ICOController.prototype, "captureOrder", null);
ICOController = __decorate([
    (0, swagger_1.ApiTags)('ICO'),
    (0, common_1.Controller)('ico'),
    __metadata("design:paramtypes", [ico_service_1.ICOService])
], ICOController);
exports.ICOController = ICOController;
//# sourceMappingURL=ico.controller.js.map