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
exports.ICOWebhookController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const submit_ico_eth_address_dto_1 = require("./dto/submit-ico-eth-address.dto");
const ico_webhook_service_1 = require("./ico.webhook.service");
let ICOWebhookController = class ICOWebhookController {
    constructor(webHookService) {
        this.webHookService = webHookService;
    }
    async handleWebhook(body) {
        if (body.event_type == 'CHECKOUT.ORDER.APPROVED') {
            return await this.webHookService.checkoutOrderApproved(body);
        }
        if (body.event_type == 'PAYMENT.CAPTURE.COMPLETED') {
            return await this.webHookService.paymentCaptureCompleted(body);
        }
    }
    async submitEthAddress(body) {
        const payment = await this.webHookService.submitEthAddress(body.payPalOrderId, body.ethAddress);
        return payment;
    }
    async claimVadiCoinsByOrderId(orderId) {
        const tsx_hash = await this.webHookService.issueVadiCoins(orderId);
        return tsx_hash;
    }
};
__decorate([
    (0, common_1.Post)('/order/completion'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ICOWebhookController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Post)('/submit-eth-address'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [submit_ico_eth_address_dto_1.SubmitICOEthAddressDTO]),
    __metadata("design:returntype", Promise)
], ICOWebhookController.prototype, "submitEthAddress", null);
__decorate([
    (0, common_1.Get)('claim/vadi-coins/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ICOWebhookController.prototype, "claimVadiCoinsByOrderId", null);
ICOWebhookController = __decorate([
    (0, swagger_1.ApiTags)('ICO/WEBHOOK'),
    (0, common_1.Controller)('ico/webhook'),
    __metadata("design:paramtypes", [ico_webhook_service_1.ICOWebHookService])
], ICOWebhookController);
exports.ICOWebhookController = ICOWebhookController;
//# sourceMappingURL=ico.webhook.controller.js.map