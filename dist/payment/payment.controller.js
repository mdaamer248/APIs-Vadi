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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const swagger_1 = require("@nestjs/swagger");
const investor_guard_1 = require("../guards/investor.guard");
const make_payment_dto_1 = require("./dto/make-payment.dto");
const hot_wallet_payment_dto_1 = require("./dto/hot-wallet-payment.dto");
const eth_to_vadi_dto_1 = require("./dto/eth-to-vadi.dto");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async create(req, payment) {
        const orderId = await this.paymentService.createOrder(payment.amount, req.token.email);
        return orderId;
    }
    async captureOrder(req, orderID) {
        const tsx = await this.paymentService.capturePayment(orderID, req.token.email);
        return tsx;
    }
    async getAllpayments() {
        const payments = await this.paymentService.getAllPayments();
        return payments;
    }
    async createHotWalletPayment(req) {
        const publicKey = await this.paymentService.createHotWalletOrder(req.token.email);
        return publicKey;
    }
    async claimVadiCoins(req, hotWalletPaymentDto) {
        const res = await this.paymentService.claimVadiCoins(req.token.email, hotWalletPaymentDto.metamask_address);
        return res;
    }
    async exchangeToVadiCoins(req, ethToVadiDto) {
        const res = await this.paymentService.exchangeToVdcCoins(req.token.email, ethToVadiDto.eth_amount);
        return res;
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.Post)('/create/order'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, make_payment_dto_1.MakePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.Post)('capture/:orderID'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('orderID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "captureOrder", null);
__decorate([
    (0, common_1.Get)('get-all-payments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getAllpayments", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.Post)('/hot-wallet-pay'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createHotWalletPayment", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.Post)('/claim-vadi-coin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, hot_wallet_payment_dto_1.HotWalletPaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "claimVadiCoins", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.Post)('/exchange/eth-to-vadi'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, eth_to_vadi_dto_1.EthToVadiDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "exchangeToVadiCoins", null);
PaymentController = __decorate([
    (0, swagger_1.ApiTags)('Payment'),
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map