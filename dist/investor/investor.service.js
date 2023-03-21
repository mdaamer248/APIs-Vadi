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
exports.InvestorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const investor_entity_1 = require("./entities/investor.entity");
const common_2 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const util_1 = require("util");
const scrypt = (0, util_1.promisify)(crypto_1.scrypt);
const Vonage = require('@vonage/server-sdk');
let InvestorService = class InvestorService {
    constructor(investorRepository, userRepository, configService) {
        this.investorRepository = investorRepository;
        this.userRepository = userRepository;
        this.configService = configService;
        this.sendSMS = (from, to, text) => new Promise((resolve, reject) => {
            this.vonage.message.sendSms(from, to, text, { type: 'unicode' }, (err, responseData) => {
                if (err) {
                    resolve({ code: 201, message: err });
                }
                else {
                    if (responseData.messages[0]['status'] === '0') {
                        resolve({ code: 200, message: 'Message sent successfully.' });
                    }
                    else {
                        resolve({
                            code: 201,
                            message: `Message failed with error: ${responseData.messages[0]['error-text']}`,
                        });
                    }
                }
            });
        });
        this.vonage = new Vonage({
            apiKey: process.env.SMS_APIKEY,
            apiSecret: process.env.SMS_APISECRET,
        });
    }
    async create(email, password) {
        try {
            const investor = { email, password };
            const newInvestor = this.investorRepository.create(investor);
            await this.investorRepository.save(newInvestor);
            return newInvestor;
        }
        catch (err) {
            console.log('Error creating user', err);
            throw new common_2.InternalServerErrorException();
        }
    }
    async update(id, updateInvestorDto) {
        const investor = await this.findOne(id);
        const keys = Object.keys(updateInvestorDto);
        if (keys.includes('password'))
            updateInvestorDto['password'] = await this.genPasswordHash(updateInvestorDto['password']);
        keys.forEach((key) => {
            investor[key] = updateInvestorDto[key];
        });
        const newInvestor = await this.investorRepository.save(investor);
        return investor;
    }
    async genPasswordHash(pass) {
        const salt = (0, crypto_1.randomBytes)(8).toString('hex');
        const hash = (await scrypt(pass, salt, 32));
        const result = salt + '.' + hash.toString('hex');
        const hashedPassword = String(result);
        return hashedPassword;
    }
    async findAll() {
        const investors = await this.investorRepository.find();
        if (!investors)
            throw new common_2.NotFoundException();
        return investors;
    }
    async findOne(id) {
        const investor = await this.investorRepository.findOne({ where: { id }, relations: ['wallet'] });
        if (!investor)
            throw new common_2.NotFoundException();
        return investor;
    }
    async findByEmail(email) {
        let inv;
        const investors = await this.investorRepository.find({
            relations: ['wallet'],
        });
        investors.forEach((investor) => {
            if (investor.email == email)
                inv = investor;
        });
        if (!inv)
            throw new common_2.NotFoundException('Investor Not found');
        return inv;
    }
    async sendOTP(dto) {
        const { dailcode, mobile } = dto;
        const validationCode = Math.floor(Math.random() * 10000);
        const from = 'Vonage APIs';
        const number = mobile;
        const code = dailcode;
        const to = `${code}` + number;
        const text = `Your otp from Vadi is ${validationCode}`;
        const data = new user_entity_1.User();
        (data.mobile = mobile),
            (data.smsOtp = validationCode),
            (data.dailCode = code);
        await this.userRepository.save(data);
        const result = await this.sendSMS(from, to, text);
        if (result['code'] === 200) {
            const message = result['message'];
            return { code: 200, message };
        }
        else {
            const message = result['message'];
            return { code: 201, message };
        }
    }
    async verifyOTP(mobile, otp) {
        const investor = await this.userRepository.findOne({ where: { mobile } });
        if (investor.smsOtp != otp) {
            return { code: 201, message: 'Wrong OTP' };
        }
        else {
            return { code: 200, message: 'Otp verified' };
        }
    }
    find(email) {
        return this.investorRepository.find({ where: { email } });
    }
    remove(id) {
        return `This action removes a #${id} investor`;
    }
    async marketdata() {
        const request = require('request-promise');
        const options = {
            method: 'GET',
            uri: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false',
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'accept-language': 'EN',
            },
        };
        var res = await request(options)
            .then(function (response) {
            return response;
        })
            .catch(function (err) {
            return err;
        });
        var list = [
            'BTC',
            'ETH',
            'LTC',
            'USDT',
            'USDC',
            'SOL',
            'MATIC',
            'ADA',
            'AVAX',
            'FTM',
            'BNB',
            'ATOM',
            'NEAR',
            'ALGO',
            'UNI',
            'CAKE',
            'AAVE',
            'CRV',
        ];
        var result = res.filter((item) => list.includes(item.symbol.toUpperCase()));
        return { message: 'success', result };
    }
    async walletMarketdata() {
        const request = require('request-promise');
        const options = {
            method: 'GET',
            uri: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false',
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'accept-language': 'EN',
            },
        };
        var res = await request(options)
            .then(function (response) {
            return response;
        })
            .catch(function (err) {
            return err;
        });
        var list = ['ETH', 'SOL', 'MATIC', 'BNB'];
        var result = res.filter((item) => list.includes(item.symbol.toUpperCase()));
        return { message: 'success', result };
    }
};
InvestorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(investor_entity_1.Investor)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], InvestorService);
exports.InvestorService = InvestorService;
//# sourceMappingURL=investor.service.js.map