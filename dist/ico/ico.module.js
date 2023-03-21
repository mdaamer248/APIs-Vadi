"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICOModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hot_wallet_ico_entity_1 = require("./entity/hot-wallet.ico.entity");
const paypal_ico_entity_1 = require("./entity/paypal-ico.entity");
const ico_controller_1 = require("./ico.controller");
const ico_service_1 = require("./ico.service");
const ico_webhook_controller_1 = require("./ico.webhook.controller");
const ico_webhook_service_1 = require("./ico.webhook.service");
let ICOModule = class ICOModule {
};
ICOModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([hot_wallet_ico_entity_1.HotWalletICO]),
            typeorm_1.TypeOrmModule.forFeature([paypal_ico_entity_1.PayPalIcoPayment])],
        controllers: [ico_controller_1.ICOController, ico_webhook_controller_1.ICOWebhookController],
        providers: [ico_service_1.ICOService, ico_webhook_service_1.ICOWebHookService],
    })
], ICOModule);
exports.ICOModule = ICOModule;
//# sourceMappingURL=ico.module.js.map