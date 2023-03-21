"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const payment_controller_1 = require("./payment.controller");
const investor_module_1 = require("../investor/investor.module");
const wallet_module_1 = require("../wallet/wallet.module");
const webhook_service_1 = require("./webhook.service");
const webhook_controller_1 = require("./webhook.controller");
const payment_entity_1 = require("./entities/payment.entity");
const typeorm_1 = require("@nestjs/typeorm");
const hotpayment_entity_1 = require("./entities/hotpayment.entity");
let PaymentModule = class PaymentModule {
};
PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([payment_entity_1.Pay]),
            typeorm_1.TypeOrmModule.forFeature([hotpayment_entity_1.HotPay]),
            investor_module_1.InvestorModule,
            wallet_module_1.WalletModule,
        ],
        controllers: [payment_controller_1.PaymentController, webhook_controller_1.WebhookController],
        providers: [payment_service_1.PaymentService, webhook_service_1.WebHookService],
    })
], PaymentModule);
exports.PaymentModule = PaymentModule;
//# sourceMappingURL=payment.module.js.map