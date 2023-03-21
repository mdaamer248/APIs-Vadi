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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const admin_service_1 = require("./admin.service");
const util_1 = require("util");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("./mail/mail.service");
const investor_service_1 = require("../investor/investor.service");
const scrypt = (0, util_1.promisify)(crypto_1.scrypt);
let AuthService = class AuthService {
    constructor(adminService, jwtService, mailService, investorService) {
        this.adminService = adminService;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.investorService = investorService;
    }
    async signup(createAdminDto) {
        const { userName, email, password } = createAdminDto;
        const admin = await this.adminService.find(email);
        if (admin.length) {
            throw new common_1.BadRequestException('Email already in use');
        }
        const salt = (0, crypto_1.randomBytes)(8).toString('hex');
        const hash = (await scrypt(password, salt, 32));
        const result = salt + '.' + hash.toString('hex');
        const hashedPassword = String(result);
        const newAdmin = await this.adminService.create(userName, email, hashedPassword);
        const payload = { email: newAdmin.email, isInvestor: true };
        const mail = newAdmin.email;
        return {
            access_token: this.jwtService.sign(payload),
            mail
        };
    }
    async signin(email, password) {
        const [admin] = await this.adminService.find(email);
        if (!admin) {
            throw new common_1.NotFoundException('Admin not found');
        }
        const [salt, storedHash] = admin.password.split('.');
        const hash = (await scrypt(password, salt, 32));
        if (storedHash !== hash.toString('hex')) {
            throw new common_1.BadRequestException('Email or Password is wrong');
        }
        const payload = { email: admin.email, isInvestor: true };
        const mail = admin.email;
        return {
            access_token: this.jwtService.sign(payload),
            mail
        };
    }
    async sendUserPasswordResetMail(email) {
        const [admin] = await this.adminService.find(email);
        if (!admin)
            throw new common_1.HttpException('Admin does not exists.', 404);
        const resetToken = (0, crypto_1.randomBytes)(16).toString('hex');
        const payload = { email, resetToken, isInvestor: true };
        const access_token = this.jwtService.sign(payload);
        await this.mailService.sendUserPasswordResetEMail(email);
    }
    async resetPassword(email, newPassword) {
        const [admin] = await this.adminService.find(email);
        if (!admin)
            return { message: 'Admin does not exists.' };
        const salt = (0, crypto_1.randomBytes)(8).toString('hex');
        const hash = (await scrypt(newPassword, salt, 32));
        const result = salt + '.' + hash.toString('hex');
        const hashedPassword = String(result);
        this.adminService.update(admin.id, { newPassword: hashedPassword });
        return { message: 'Your password has been changed' };
    }
    async investorSignup(createInvestorDto) {
        const { email, password } = createInvestorDto;
        const [investors] = await this.investorService.find(email);
        if (investors) {
            if (investors.isConfirmed == true) {
                return {
                    message: 'Email already in use'
                };
            }
            else {
                return { message: 'Please verify your Account' };
            }
        }
        const salt = (0, crypto_1.randomBytes)(8).toString('hex');
        const hash = (await scrypt(password, salt, 32));
        const result = salt + '.' + hash.toString('hex');
        const hashedPassword = String(result);
        const investor = await this.adminService.createInvestor(email, hashedPassword);
        if (investor) {
            const payload = { email: investor.email, isInvestor: true };
            const mail = investor.email;
            const id = investor.id;
            return {
                access_token: this.jwtService.sign(payload),
                message: "Success",
                mail,
                id
            };
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        jwt_1.JwtService,
        mail_service_1.MailService,
        investor_service_1.InvestorService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=admin.auth.service.js.map