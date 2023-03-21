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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const investor_service_1 = require("./investor.service");
const mail_service_1 = require("./mail/mail.service");
const crypto_1 = require("crypto");
const util_1 = require("util");
const jwt_1 = require("@nestjs/jwt");
const scrypt = (0, util_1.promisify)(crypto_1.scrypt);
let AuthService = class AuthService {
    constructor(investorService, jwtService, mailService) {
        this.investorService = investorService;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async signup(createInvestorDto) {
        const { email, password } = createInvestorDto;
        const [investors] = await this.investorService.find(email);
        if (investors) {
            return {
                message: 'Email already in use',
            };
        }
        const salt = (0, crypto_1.randomBytes)(8).toString('hex');
        const hash = (await scrypt(password, salt, 32));
        const result = salt + '.' + hash.toString('hex');
        const hashedPassword = String(result);
        const investor = await this.investorService.create(email, hashedPassword);
        if (investor) {
            const code = await this.getOTP(investor.email);
            const payload = { email: investor.email, isInvestor: true };
            const mail = investor.email;
            const id = investor.id;
            const access_token = this.jwtService.sign(payload);
            return {
                access_token,
                message: 'Success,Verification code has been sent to your Mail',
                mail,
                id,
            };
        }
    }
    async signin(email, password) {
        const [investor] = await this.investorService.find(email);
        if (!investor) {
            return {
                message: 'User not found with this Email',
            };
        }
        const [salt, storedHash] = investor.password.split('.');
        const hash = (await scrypt(password, salt, 32));
        if (storedHash !== hash.toString('hex')) {
            return {
                message: 'Email or Password is wrong',
            };
        }
        const payload = { email: investor.email, isInvestor: true };
        const mail = investor.email;
        const id = investor.id;
        const isVerified = investor.isConfirmed;
        const isTokenSubscribed = investor.isTokenSubscribed;
        return {
            access_token: this.jwtService.sign(payload),
            message: 'Login Success',
        };
    }
    async validatePassword(email, password) {
        const [investor] = await this.investorService.find(email);
        if (!investor)
            return { message: 'No registration found with this Email' };
        const [salt, storedHash] = investor.password.split('.');
        const hash = (await scrypt(password, salt, 32));
        if (storedHash !== hash.toString('hex')) {
            return {
                message: 'Incorrect password',
            };
        }
        return { message: 'success ' };
    }
    async tokenSubscription(email) {
        const [investor] = await this.investorService.find(email);
        if (!investor)
            return { message: 'No registration found with this Email' };
        if (investor.isTokenSubscribed == true) {
            console.log(investor);
            return {
                message: 'Already subscribed',
            };
        }
        else {
            investor.isTokenSubscribed = true;
            await this.investorService.update(investor.id, investor);
            console.log(investor);
            return { message: 'subscription success ' };
        }
    }
    async sendUserPasswordResetMail(email) {
        const [investor] = await this.investorService.find(email);
        if (!investor)
            return { message: 'User does not exists.' };
        const _a = await this.mailService.sendUserPasswordResetEMail(investor, email), { resetTokenIssuedAt } = _a, result = __rest(_a, ["resetTokenIssuedAt"]);
        await this.investorService.update(investor.id, { resetTokenIssuedAt });
        return result;
    }
    async resetPassword(email, password) {
        const [investor] = await this.investorService.find(email);
        if (!investor)
            return { message: 'User does not exists.' };
        this.investorService.update(investor.id, { password });
        return {
            message: 'Your password has been changed',
        };
    }
    async getOTP(email) {
        const investor = await this.investorService.findByEmail(email);
        const validationCode = Math.floor(Math.random() * 1000000);
        const _a = await this.mailService.sendUserConfirmationMail(investor, validationCode), { otpIssuedAt } = _a, result = __rest(_a, ["otpIssuedAt"]);
        await this.investorService.update(investor.id, { validationCode, otpIssuedAt });
        return result;
    }
    async submitOTP(email, otp) {
        const [investor] = await this.investorService.find(email);
        if (!investor)
            return { message: 'User not found with this Email' };
        if (investor.isConfirmed)
            return { message: 'Already Verified' };
        if (investor.validationCode != otp)
            return { message: 'Wrong OTP' };
        const isConfirmed = true;
        await this.investorService.update(investor.id, { isConfirmed });
        return {
            message: 'User Confirmed his/her Email',
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [investor_service_1.InvestorService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map