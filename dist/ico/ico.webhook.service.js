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
const paypal_service_1 = require("./paypal.service");
let ICOWebHookService = class ICOWebHookService {
    constructor(icoService, paypalService) {
        this.icoService = icoService;
        this.paypalService = paypalService;
    }
    async checkoutOrderApproved(body) {
        const order_id = body.resource.id;
        const status = body.resource.status;
        const orderInfo = await this.icoService.getPaymentByOrderId(order_id);
        if (orderInfo.status !== 'COMPLETED') {
            orderInfo.status = status;
            await this.icoService.savePayment(orderInfo);
            return 'Payment has been updated';
        }
        return 'Payment is already been confirmed.';
    }
    async paymentCaptureCompleted(body) {
        const order_id = body.resource.supplementary_data.related_ids.order_id;
        const net_amount = body.resource.seller_receivable_breakdown.net_amount.value;
        const orderInfo = await this.icoService.getPaymentByOrderId(order_id);
        if (!orderInfo.net_amount) {
            orderInfo.status = net_amount;
            await this.icoService.savePayment(orderInfo);
            return 'Payment has been updated';
        }
        return 'Payment already has net amount with it.';
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
            return new common_1.HttpException('Submit your eth address first before claiming coins.', common_1.HttpStatus.EXPECTATION_FAILED);
        if (orderInfo.vadi_coin_transfered)
            return new common_1.HttpException('Claimed for this orderId has already been made.', common_1.HttpStatus.EXPECTATION_FAILED);
        if (orderInfo.status !== 'COMPLETED') {
            const data = await this.paypalService.getOrderDetailsById(orderId);
            orderInfo.status = data.status;
            await this.icoService.savePayment(orderInfo);
        }
        if (orderInfo.net_amount) {
            hash = await this.icoService.issueTokens(orderInfo.net_amount, orderId);
            return hash;
        }
        return new common_1.HttpException('Paypal Have not confirmed your payment yet. Try after some time, with the OrderId.', common_1.HttpStatus.EXPECTATION_FAILED);
    }
};
ICOWebHookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ico_service_1.ICOService,
        paypal_service_1.PayPalService])
], ICOWebHookService);
exports.ICOWebHookService = ICOWebHookService;
//# sourceMappingURL=ico.webhook.service.js.map