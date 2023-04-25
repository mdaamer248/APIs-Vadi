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
exports.VdcController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const send_coin_dto_1 = require("../../dto/send-coin.dto");
const investor_guard_1 = require("../../../guards/investor.guard");
const vadicoin_service_1 = require("./vadicoin.service");
let VdcController = class VdcController {
    constructor(vdcService) {
        this.vdcService = vdcService;
    }
    async sendEth(req, sendVdcDto) {
        const tsx = await this.vdcService.sendVadiCoin(req.token.email, sendVdcDto);
        return tsx;
    }
    async purchaseEth(req, amount) {
        const tsx = await this.vdcService.purchaseVadiCoin(req.token.email, amount);
        console.log(tsx);
        return tsx;
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.Post)('send/vadicoin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, send_coin_dto_1.SendCoinDto]),
    __metadata("design:returntype", Promise)
], VdcController.prototype, "sendEth", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.Get)('purchase/vadicoin/:amount'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], VdcController.prototype, "purchaseEth", null);
VdcController = __decorate([
    (0, swagger_1.ApiTags)('VadiCoin'),
    (0, common_1.Controller)('vdc'),
    __metadata("design:paramtypes", [vadicoin_service_1.VdcService])
], VdcController);
exports.VdcController = VdcController;
//# sourceMappingURL=vadicoin.controller.js.map