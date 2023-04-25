"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebHookService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const payment_service_1 = require("./payment.service");
let WebHookService = class WebHookService {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    verifySignature(transmissionId, body, signature) {
        let isVerified = false;
        if (transmissionId) {
            const verificationBodyJson = JSON.stringify(body);
            const verificationSeed = `${transmissionId}.${verificationBodyJson}`;
            const verificationSignatureBuffer = Buffer.from(signature, 'base64');
            const verificationSeedBuffer = Buffer.from(verificationSeed);
            const verificationHash = crypto
                .createHmac('sha256', process.env.WEBHOOK_SECRET)
                .update(verificationSeedBuffer)
                .digest('base64');
            const uint = Buffer.from(verificationHash, 'base64');
            if (verificationSignatureBuffer.equals(uint)) {
                isVerified = true;
            }
        }
        return isVerified;
    }
    async checkoutOrderApproved(body) {
        const order_id = body.resource.id;
        const payer_name = body.resource.payer.name.given_name +
            ' ' +
            body.resource.payer.name.surname;
        const payer_email = body.resource.payer.email_address;
        const status = body.resource.status;
        await this.paymentService.updatePayment({
            order_id,
            payer_email,
            payer_name,
            status,
        });
        return 'Payment has been updated';
    }
    async paymentCaptureCompleted(body) {
        const order_id = body.resource.supplementary_data.related_ids.order_id;
        const currency = body.resource.amount.currency_code;
        const gross_amount = body.resource.seller_receivable_breakdown.gross_amount.value;
        const net_amount = body.resource.seller_receivable_breakdown.net_amount.value;
        const paypal_fee = body.resource.seller_receivable_breakdown.paypal_fee.value;
        const updatedPayment = await this.paymentService.updatePayment({
            order_id,
            currency,
            gross_amount,
            net_amount,
            paypal_fee,
        });
        const transferUpdate = await this.paymentService.issueTokens(net_amount, order_id, updatedPayment.user_email);
        return 'Payment has been updated';
    }
    async submitEthAddress(order_id, eth_address) {
        const updatedPayment = await this.paymentService.updatePayment({ order_id, eth_address });
        return updatedPayment;
    }
};
WebHookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], WebHookService);
exports.WebHookService = WebHookService;
//# sourceMappingURL=webhook.service.js.map