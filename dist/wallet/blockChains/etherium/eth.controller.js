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
exports.EthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const eth_service_1 = require("./eth.service");
const investor_guard_1 = require("../../../guards/investor.guard");
const send_coin_dto_1 = require("../../dto/send-coin.dto");
let EthController = class EthController {
    constructor(ethService) {
        this.ethService = ethService;
    }
    async sendEth(req, sendEthDto) {
        const tsx = await this.ethService.sendEth(req.token.email, sendEthDto);
        return tsx;
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.Post)('send/eth'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, send_coin_dto_1.SendCoinDto]),
    __metadata("design:returntype", Promise)
], EthController.prototype, "sendEth", null);
EthController = __decorate([
    (0, swagger_1.ApiTags)('Etherium (Goerli)'),
    (0, common_1.Controller)('eth'),
    __metadata("design:paramtypes", [eth_service_1.EthService])
], EthController);
exports.EthController = EthController;
//# sourceMappingURL=eth.controller.js.map