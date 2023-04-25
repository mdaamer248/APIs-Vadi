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
exports.SolController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const send_coin_dto_1 = require("../../dto/send-coin.dto");
const investor_guard_1 = require("../../../guards/investor.guard");
const sol_service_1 = require("./sol.service");
let SolController = class SolController {
    constructor(solService) {
        this.solService = solService;
    }
    async sendEth(req, sendSolDto) {
        const tsx = await this.solService.sendSol(req.token.email, sendSolDto);
        return tsx;
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.Post)('send/sol'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, send_coin_dto_1.SendCoinDto]),
    __metadata("design:returntype", Promise)
], SolController.prototype, "sendEth", null);
SolController = __decorate([
    (0, swagger_1.ApiTags)('Solana (Dev-net)'),
    (0, common_1.Controller)('sol'),
    __metadata("design:paramtypes", [sol_service_1.SolService])
], SolController);
exports.SolController = SolController;
//# sourceMappingURL=sol.controller.js.map