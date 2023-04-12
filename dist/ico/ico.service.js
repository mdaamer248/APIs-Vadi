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
exports.ICOService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = __importDefault(require("axios"));
const typeorm_2 = require("typeorm");
const hot_wallet_ico_entity_1 = require("./entity/hot-wallet.ico.entity");
const paypal_ico_entity_1 = require("./entity/paypal-ico.entity");
const Web3 = require('web3');
const ABI = require('../../abi.json');
let ICOService = class ICOService {
    constructor(icoTsxsRepository, payPalRepository, configService) {
        this.icoTsxsRepository = icoTsxsRepository;
        this.payPalRepository = payPalRepository;
        this.configService = configService;
        this.web3 = new Web3(this.configService.get('MAINNET_RPC'));
        this.web3.eth.accounts.wallet.add(this.configService.get('TREASURER_PRIVATE_KEY'));
        this.account = this.web3.eth.accounts.wallet[0];
        this.contract = new this.web3.eth.Contract(ABI, this.configService.get('VADI_COIN_TRANSPARENT_CONTRACT_ADDRESS'));
    }
    async claimCoins(tsxHash, eth_address) {
        let tokenRecieved;
        let tsx_hash;
        const details = await this.web3.eth.getTransactionReceipt(tsxHash);
        if (details.logs[0].topics[0] !=
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
            throw new common_1.HttpException('Transaction hash is not of Transfer Function', common_1.HttpStatus.BAD_REQUEST);
        }
        if ('0x' +
            this.web3.utils
                .stripHexPrefix(details.logs[0].topics[2])
                .slice(24)
                .toLowerCase() !=
            this.configService
                .get('VADIVAULT_ADDRESS')
                .toLocaleLowerCase()) {
            throw new common_1.HttpException('The recieving address does not belong to vadiVault Owner.', common_1.HttpStatus.BAD_REQUEST);
        }
        if ('0x' +
            this.web3.utils
                .stripHexPrefix(details.logs[0].topics[1])
                .slice(24)
                .toLowerCase() !=
            eth_address.toLowerCase()) {
            throw new common_1.HttpException('This transaction hash does not belongs to you', common_1.HttpStatus.BAD_REQUEST);
        }
        if (details.to.toLowerCase() ==
            this.configService.get('USDC_ADDRESS').toLowerCase()) {
            const [transaction] = await this.icoTsxsRepository.find({
                where: {
                    recieved_token_tsx_hash: tsxHash,
                },
            });
            if (transaction && transaction.tsx_status == 'Completed') {
                throw new common_1.HttpException('Vadi Coins are already claimed for this TSX Hash', common_1.HttpStatus.BAD_REQUEST);
            }
            tokenRecieved =
                this.web3.utils.hexToNumberString(details.logs[0].data) / 10 ** 6;
            tsx_hash = await this.transferVadiCoins(eth_address, 20 * tokenRecieved);
            const status = await this.checkTransactionStatus(tsx_hash);
            if (status == '"1"') {
                const icoTsx = {
                    recieved_token_tsx_hash: tsxHash,
                    recieved_token_amount: tokenRecieved,
                    users_eth_address: eth_address,
                    recieved_token_name: 'USDC',
                    tsx_status: 'Completed',
                    vadi_coin_amount: 20 * tokenRecieved,
                    vadi_coins_transfered: true,
                    vadi_coin_transfer_tsx_hash: tsx_hash,
                };
                await this.createTsx(icoTsx);
            }
            return tsx_hash;
        }
    }
    async transferVadiCoins(address, amount) {
        const transfer = await this.contract.methods
            .transfer(address, Math.floor(amount))
            .send({
            from: this.account.address,
            gas: 490000,
            gasPrice: 80000000000,
        });
        return transfer.transactionHash;
    }
    async issueTokens(amountPaid, order_id) {
        const vadi_coin_amount = amountPaid.toString();
        const orderInfo = await this.getPaymentByOrderId(order_id);
        const tsx = await this.transferVadiCoins(orderInfo.eth_address, parseFloat(vadi_coin_amount));
        const tokenTransferStatus = await this.checkTransactionStatus(tsx);
        if (tokenTransferStatus == '"1"') {
            await this.updatePayment({
                order_id,
                vadi_coin_amount,
                vadi_coin_transfered: true,
                vadi_coin_transfer_tsx_hash: tsx,
            });
            return tsx;
        }
        return tsx;
    }
    async ethToVadiCoin(tsx_hash) {
        const [tsx] = await this.icoTsxsRepository.find({
            where: {
                recieved_token_tsx_hash: tsx_hash,
            },
        });
        if (tsx && tsx.tsx_status == 'Completed')
            throw new common_1.HttpException('Tokens are already claimed for this Transaction hash.', common_1.HttpStatus.BAD_REQUEST);
        const details = await this.web3.eth.getTransaction(tsx_hash);
        if (details.to.toLocaleLowerCase() !=
            '0x089797d601E7973278e62008bEbE693cA060A396'.toLocaleLowerCase())
            throw new common_1.HttpException('Etherium was not send to vadi coin address', common_1.HttpStatus.BAD_REQUEST);
        const ethAmount = this.web3.utils.fromWei(details.value, 'ether');
        const ethPriceInMxn = await axios_1.default
            .get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=mxn')
            .then((res) => {
            return res.data.ethereum.mxn;
        })
            .catch((e) => {
            console.log(e.data.result);
        });
        const hash = await this.transferVadiCoins(details.from, ethAmount * ethPriceInMxn);
        const tokenTransferStatus = await this.checkTransactionStatus(hash);
        if (tokenTransferStatus == '"1"') {
            await this.createTsx({
                recieved_token_amount: ethAmount,
                recieved_token_name: 'ETH',
                recieved_token_tsx_hash: tsx_hash,
                tsx_status: 'Completed',
                vadi_coins_transfered: true,
                vadi_coin_transfer_tsx_hash: hash,
                vadi_coin_amount: ethAmount * ethPriceInMxn,
                users_eth_address: details.from,
            });
        }
        return hash;
    }
    async ethTsxUpdate(tsx_hash) {
        const [tsx] = await this.icoTsxsRepository.find({
            where: {
                recieved_token_tsx_hash: tsx_hash,
            },
        });
        if (tsx && tsx.tsx_status == 'Completed')
            throw new common_1.HttpException('Tokens are already claimed for this Transaction hash.', common_1.HttpStatus.BAD_REQUEST);
        const details = await this.web3.eth.getTransactionReceipt(tsx_hash);
        const ethDetails = await this.web3.eth.getTransaction(tsx_hash);
        const vadi_coins_transfered = this.web3.utils.hexToNumber(details.logs[0].data) / 10 ** 8;
        if (details.to.toLocaleLowerCase() !=
            this.configService
                .get('VADI_COIN_TRANSPARENT_CONTRACT_ADDRESS')
                .toLocaleLowerCase())
            throw new common_1.HttpException('Etherium was not send to Vadi smart contract.', common_1.HttpStatus.BAD_REQUEST);
        const ethAmount = this.web3.utils.fromWei(ethDetails.value, 'ether');
        await this.createTsx({
            recieved_token_amount: ethAmount,
            recieved_token_name: 'ETH',
            recieved_token_tsx_hash: tsx_hash,
            tsx_status: 'Completed',
            vadi_coins_transfered: true,
            vadi_coin_transfer_tsx_hash: tsx_hash,
            vadi_coin_amount: vadi_coins_transfered,
            users_eth_address: details.from,
        });
        return {
            tsx_hash,
            tsx_status: 'Completed',
        };
    }
    async createTsx(createIcoTsx) {
        const recieved_token_tsx_hash = createIcoTsx.recieved_token_tsx_hash;
        const [tsx] = await this.icoTsxsRepository.find({
            where: {
                recieved_token_tsx_hash,
            },
        });
        if (tsx)
            throw new common_1.HttpException('Duplicate Hash Found', common_1.HttpStatus.BAD_REQUEST);
        const transaction = await this.icoTsxsRepository.create(createIcoTsx);
        const savedTsx = await this.icoTsxsRepository.save(transaction);
        return savedTsx;
    }
    async updateTsx(updateTsxDto) {
        const tsx = await this.findByRecievedTsxHash(updateTsxDto.recieved_token_tsx_hash);
        const keys = Object.keys(updateTsxDto);
        keys.forEach((key) => {
            tsx[key] = updateTsxDto[key];
        });
        const savedTsx = await this.icoTsxsRepository.save(tsx);
        return savedTsx;
    }
    async findByRecievedTsxHash(hash) {
        const [tsx] = await this.icoTsxsRepository.find({
            where: {
                recieved_token_tsx_hash: hash,
            },
        });
        if (!tsx)
            throw new common_1.NotFoundException('ICO Tsx does not exists.');
        return tsx;
    }
    async checkTransactionStatus(hash) {
        const config = {
            method: 'get',
            url: `https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${hash}&apikey=${this.configService.get('ETHERSCAN_API_KEY')}`,
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
        await this.createPayment({ order_id: orderID });
        return { orderID };
    }
    async capturePayment(orderId) {
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
        const payment = await this.payPalRepository.create(createPaymentDto);
        await this.payPalRepository.save(payment);
        return payment;
    }
    async getPaymentByOrderId(order_id) {
        const [paymentInfo] = await this.payPalRepository.find({
            where: { order_id },
        });
        return paymentInfo;
    }
    async getAllPayments() {
        const payments = await this.payPalRepository.find();
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
        await this.payPalRepository.save(payment);
        return payment;
    }
};
ICOService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hot_wallet_ico_entity_1.HotWalletICO)),
    __param(1, (0, typeorm_1.InjectRepository)(paypal_ico_entity_1.PayPalIcoPayment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], ICOService);
exports.ICOService = ICOService;
//# sourceMappingURL=ico.service.js.map