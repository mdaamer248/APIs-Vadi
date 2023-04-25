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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayPalService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const ico_service_1 = require("./ico.service");
let PayPalService = class PayPalService {
    constructor(configService, icoService) {
        this.configService = configService;
        this.icoService = icoService;
    }
    async createOrder(amount) {
        const accessToken = await this.generateAccessToken();
        const url = `${this.configService.get('BASE')}/v2/checkout/orders`;
        const body = JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'MXN',
                        value: amount,
                    },
                },
            ],
        });
        const config = {
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                Prefer: 'return=representation',
                Authorization: `Bearer ${accessToken}`,
            },
            data: body,
        };
        const orderID = await (0, axios_1.default)(config)
            .then((res) => {
            return res.data.id;
        })
            .catch((error) => console.log(error.res.data));
        await this.icoService.createPayment({ order_id: orderID });
        return { orderID };
    }
    async capturePayment(orderId) {
        const accessToken = await this.generateAccessToken();
        const orderInfo = await this.icoService.getPaymentByOrderId(orderId);
        const url = `${this.configService.get('BASE')}/v2/checkout/orders/${orderId}/capture`;
        const config = {
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const res = await (0, axios_1.default)(config)
            .then(function (response) {
            return response.data;
        })
            .catch(function (error) {
            console.log(error);
        });
        orderInfo.net_amount =
            res.purchase_units[0].payments.captures[0].seller_receivable_breakdown.net_amount.value;
        orderInfo.gross_amount =
            res.purchase_units[0].payments.captures[0].seller_receivable_breakdown.gross_amount.value;
        orderInfo.paypal_fee =
            res.purchase_units[0].payments.captures[0].seller_receivable_breakdown.paypal_fee.value;
        orderInfo.currency =
            res.purchase_units[0].payments.captures[0].seller_receivable_breakdown.net_amount.currency_code;
        orderInfo.payer_name =
            res.payment_source.paypal.name.given_name +
                ' ' +
                res.payment_source.paypal.name.surname;
        orderInfo.payer_email = res.payment_source.paypal.email_address;
        orderInfo.status = res.purchase_units[0].payments.captures[0].status;
        await this.icoService.savePayment(orderInfo);
        return res;
    }
    async getOrderDetailsById(orderId) {
        const accessToken = await this.generateAccessToken();
        const url = `${this.configService.get('BASE')}/v2/checkout/orders/${orderId}`;
        const config = {
            method: 'get',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const res = await (0, axios_1.default)(config)
            .then(function (response) {
            return response.data;
        })
            .catch(function (error) {
            console.log(error);
        });
        return res;
    }
    async generateAccessToken() {
        const auth = Buffer.from(this.configService.get('CLIENT_ID') +
            ':' +
            this.configService.get('APP_SECRET')).toString('base64');
        const config = {
            url: `${this.configService.get('BASE')}/v1/oauth2/token`,
            method: 'post',
            data: 'grant_type=client_credentials',
            headers: {
                Authorization: `Basic ${auth}`,
            },
        };
        const access_token = await (0, axios_1.default)(config)
            .then((res) => {
            return res.data.access_token;
        })
            .catch((e) => console.log(e));
        return access_token;
    }
};
PayPalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        ico_service_1.ICOService])
], PayPalService);
exports.PayPalService = PayPalService;
//# sourceMappingURL=paypal.service.js.map