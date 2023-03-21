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
exports.ICOWebHookService = void 0;
const common_1 = require("@nestjs/common");
const ico_service_1 = require("./ico.service");
let ICOWebHookService = class ICOWebHookService {
    constructor(icoService) {
        this.icoService = icoService;
    }
    async checkoutOrderApproved(body) {
        const order_id = body.resource.id;
        const payer_name = body.resource.payer.name.given_name +
            ' ' +
            body.resource.payer.name.surname;
        const payer_email = body.resource.payer.email_address;
        const status = body.resource.status;
        await this.icoService.updatePayment({
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
        await this.icoService.updatePayment({
            order_id,
            currency,
            gross_amount,
            net_amount,
            paypal_fee,
        });
        return 'Payment has been updated';
    }
    async submitEthAddress(order_id, eth_address) {
        const updatedPayment = await this.icoService.updatePayment({
            order_id,
            eth_address,
        });
        return updatedPayment;
    }
    async issueVadiCoins(orderId) {
        let hash;
        const orderInfo = await this.icoService.getPaymentByOrderId(orderId);
        if (!orderInfo.eth_address)
            return 'First submit your eth address';
        if (orderInfo.vadi_coin_transfered)
            return 'Already claimed';
        if (orderInfo.net_amount) {
            hash = await this.icoService.issueTokens(orderInfo.net_amount, orderId);
            return hash;
        }
        return new common_1.HttpException('Paypal Have not confirmed your payment yet. Try after some time, with the OrderId.', common_1.HttpStatus.EXPECTATION_FAILED);
    }
};
ICOWebHookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ico_service_1.ICOService])
], ICOWebHookService);
exports.ICOWebHookService = ICOWebHookService;
//# sourceMappingURL=ico.webhook.service.js.map