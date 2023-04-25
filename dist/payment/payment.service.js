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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const investor_service_1 = require("../investor/investor.service");
const axios_1 = __importDefault(require("axios"));
const vadicoin_service_1 = require("../wallet/blockChains/vadiCoin/vadicoin.service");
const payment_entity_1 = require("./entities/payment.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const hotpayment_entity_1 = require("./entities/hotpayment.entity");
const multichainWallet = require('multichain-crypto-wallet');
const Web3 = require('web3');
let PaymentService = class PaymentService {
    constructor(paymentRepository, hotPayRepository, investorService, configService, vdcService) {
        this.paymentRepository = paymentRepository;
        this.hotPayRepository = hotPayRepository;
        this.investorService = investorService;
        this.configService = configService;
        this.vdcService = vdcService;
        this.web3 = new Web3(new Web3.providers.HttpProvider(this.configService.get('GOERLI_RPC')));
    }
    async createOrder(amount, user_email) {
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
        const payment = await this.createPayment({ order_id: orderID, user_email });
        return { orderID };
    }
    async capturePayment(orderId, email) {
        const accessToken = await this.generateAccessToken();
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
    async createPayment(createPaymentDto) {
        const payment = await this.paymentRepository.create(createPaymentDto);
        await this.paymentRepository.save(payment);
        return payment;
    }
    async getPaymentByOrderId(order_id) {
        const [paymentInfo] = await this.paymentRepository.find({
            where: { order_id },
        });
        return paymentInfo;
    }
    async getAllPayments() {
        const payments = await this.paymentRepository.find();
        return payments;
    }
    async updatePayment(updatePaymentDto) {
        const payment = await this.getPaymentByOrderId(updatePaymentDto.order_id);
        if (!payment)
            throw new common_1.NotFoundException('Payment does not exists');
        const keys = Object.keys(updatePaymentDto);
        keys.forEach((key) => {
            payment[key] = updatePaymentDto[key];
        });
        await this.paymentRepository.save(payment);
        return payment;
    }
    async checkTransactionStatus(hash) {
        const config = {
            method: 'get',
            url: `https://api-goerli.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${hash}&apikey=${this.configService.get('ETHERSCAN_API_KEY')}`,
            headers: {},
        };
        const status = await (0, axios_1.default)(config)
            .then(function (response) {
            return JSON.stringify(response.data.status);
        })
            .catch(function (error) {
            console.log(' gvfgsd;vj', error);
        });
        let value;
        if (typeof status == 'string')
            value = status;
        return value;
    }
    async issueTokens(amountPaid, order_id, email) {
        const tokens_amount = amountPaid.toString();
        const tsx = await this.vdcService.purchaseVadiCoin(email, parseInt(amountPaid));
        const tokenTranferStatus = await this.checkTransactionStatus(tsx.hash);
        let updatedTsx;
        if (tokenTranferStatus == '"1"') {
            updatedTsx = await this.updatePayment({
                order_id,
                tokens_amount,
                tokens_transfered: true,
                transaction_hash: tsx.hash,
            });
        }
        return updatedTsx;
    }
    async createHotWalletOrder(email) {
        const investor = await this.investorService.findByEmail(email);
        return { eth_address: investor.wallet.ethPublicKey };
    }
    async claimVadiCoins(email, senderAddress) {
        const investor = await this.investorService.findByEmail(email);
        const tsxs = await this.verifyTransaction(investor.wallet.ethPublicKey, senderAddress, email);
        const setteledTsx = await this.handlePendingTransaction(tsxs, email);
        return setteledTsx;
    }
    async verifyTransaction(vadi_address, from, user_email) {
        const tsxs = await axios_1.default
            .get(`https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${vadi_address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${this.configService.get('ETHERSCAN_API_KEY')}`)
            .then(function (response) {
            return response.data.result;
        })
            .catch(function (error) {
            console.log(error);
        });
        const recordedTsxs = await this.hotPayRepository.find({
            where: { user_email },
        });
        let recordedHashes = [];
        if (recordedTsxs.length != 0) {
            recordedHashes = recordedTsxs.map((tsx) => tsx.recieved_tsx_hash);
        }
        const res = tsxs.filter((tsx) => {
            if (tsx.to == vadi_address.toLocaleLowerCase() &&
                tsx.from == from.toLocaleLowerCase() &&
                tsx.txreceipt_status == 1 &&
                !recordedHashes.includes(tsx.hash)) {
                return true;
            }
        });
        res.forEach(async (tsx) => {
            const savedTsx = await this.createHotPay({
                user_email,
                amount: tsx.value,
                recieved_tsx_hash: tsx.hash,
                vadi_address,
                from,
                status: 'incomplete',
            });
        });
        return res;
    }
    async handlePendingTransaction(tsxs, email) {
        const tsxHandeled = tsxs.map(async (tsx) => {
            const transac = await this.vdcService.purchaseVadiCoin(email, 2);
            const tokenTranferStatus = await this.checkTransactionStatus(transac.hash);
            if (tokenTranferStatus == '"1"') {
                const updatedTsx = await this.updateHotPay({
                    recieved_tsx_hash: tsx.hash,
                    tokens_transfered: true,
                    transaction_hash: transac.hash,
                    status: 'completed',
                    tokens_amount: '2',
                });
            }
            console.log(transac.hash);
            return transac.hash;
        });
        return tsxHandeled;
    }
    async createHotPay(createHotPayDto) {
        const hotPay = this.hotPayRepository.create(createHotPayDto);
        await this.hotPayRepository.save(hotPay);
        return hotPay;
    }
    async updateHotPay(updateHotPayDto) {
        const [hotPay] = await this.hotPayRepository.find({
            where: { recieved_tsx_hash: updateHotPayDto.recieved_tsx_hash },
        });
        if (hotPay) {
            const keys = Object.keys(updateHotPayDto);
            keys.forEach((key) => {
                hotPay[key] = updateHotPayDto[key];
            });
            await this.hotPayRepository.save(hotPay);
            return hotPay;
        }
    }
    async exchangeToVdcCoins(email, amount) {
        const investor = await this.investorService.findByEmail(email);
        const ethCoinBalance = await multichainWallet.getBalance({
            address: investor.wallet.ethPublicKey,
            network: 'ethereum',
            rpcUrl: this.configService.get('GOERLI_RPC'),
        });
        if (ethCoinBalance.balance <= parseFloat(amount))
            return { message: 'Insufficient Balance' };
        const exchangeAmount = ethCoinBalance.balance - parseFloat(amount);
        console.log(exchangeAmount);
        this.web3.eth.accounts.wallet.clear();
        this.web3.eth.accounts.wallet.add(investor.wallet.ethPrivateKey);
        const tsx = await this.web3.eth.sendTransaction({
            from: investor.wallet.ethPublicKey,
            to: '0x0dEc5A633dD6f91084Bc257f80BA29a4e9ed1Bb0',
            value: this.web3.utils.toWei(amount, 'ether'),
            gas: 50000,
        });
        if (!tsx.status)
            return { message: 'Transaction failed', tsx };
        const ethPriceInMxn = await axios_1.default
            .get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=mxn')
            .then((res) => {
            return res.data.ethereum.mxn;
        })
            .catch((e) => {
            console.log(e.data.result);
        });
        const transac = await this.vdcService.purchaseVadiCoin(email, ethPriceInMxn * parseFloat(amount));
        return transac.hash;
    }
};
PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(payment_entity_1.Pay)),
    __param(1, (0, typeorm_2.InjectRepository)(hotpayment_entity_1.HotPay)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        investor_service_1.InvestorService,
        config_1.ConfigService,
        vadicoin_service_1.VdcService])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map