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
exports.InvestorController = void 0;
const common_1 = require("@nestjs/common");
const investor_service_1 = require("./investor.service");
const auth_service_1 = require("./auth.service");
const create_investor_dto_1 = require("./dto/create-investor.dto");
const update_investor_dto_1 = require("./dto/update-investor.dto");
const login_investor_dto_1 = require("./dto/login-investor.dto");
const swagger_1 = require("@nestjs/swagger");
const investor_guard_1 = require("../guards/investor.guard");
const otp_dto_1 = require("./dto/otp.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const password_dto_1 = require("./dto/password.dto");
const mobile_dto_1 = require("./dto/mobile.dto");
const smsotp_dto_1 = require("./dto/smsotp.dto");
let InvestorController = class InvestorController {
    constructor(investorService, authService) {
        this.investorService = investorService;
        this.authService = authService;
    }
    async signup(createInvestorDto) {
        const investor = await this.authService.signup(createInvestorDto);
        return investor;
    }
    async signin(loginInvestorDto) {
        const investor = await this.authService.signin(loginInvestorDto.email, loginInvestorDto.password);
        return investor;
    }
    async validatePassword(email, data) {
        const response = await this.authService.validatePassword(email, data.password);
        return response;
    }
    async tokenSubscription(email) {
        const response = await this.authService.tokenSubscription(email);
        return response;
    }
    getPasswordResetLink(email) {
        console.log(email);
        return this.authService.sendUserPasswordResetMail(email);
    }
    changeYourPassword(body) {
        return this.authService.resetPassword(body.email, body.newPassword);
    }
    generateOTP(email) {
        console.log(email);
        return this.authService.getOTP(email);
    }
    submitOTP(data) {
        return this.authService.submitOTP(data.email, data.otp);
    }
    findAll() {
        return this.investorService.findAll();
    }
    findByEmail(req) {
        return this.investorService.findByEmail(req.token.email);
    }
    findOne(id) {
        return this.investorService.findOne(+id);
    }
    update(id, updateInvestorDto) {
        return this.investorService.update(+id, updateInvestorDto);
    }
    remove(id) {
        return this.investorService.remove(+id);
    }
    sendtOTP(phone) {
        return this.investorService.sendOTP(phone);
    }
    verifyOTP(data) {
        return this.investorService.verifyOTP(data.mobile, data.otp);
    }
    coins() {
        return this.investorService.marketdata();
    }
    walletCoins() {
        return this.investorService.walletMarketdata();
    }
    async getInvestorByEmail(email) {
        const investor = await this.investorService.findByEmail(email);
        return investor;
    }
};
__decorate([
    (0, common_1.Post)('auth/signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_investor_dto_1.CreateInvestorDto]),
    __metadata("design:returntype", Promise)
], InvestorController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('auth/signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_investor_dto_1.LoginInvestorDto]),
    __metadata("design:returntype", Promise)
], InvestorController.prototype, "signin", null);
__decorate([
    (0, common_1.Post)('/investor/validate-password/:email'),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, password_dto_1.PasswordDto]),
    __metadata("design:returntype", Promise)
], InvestorController.prototype, "validatePassword", null);
__decorate([
    (0, common_1.Post)('/investor/token-subscription/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvestorController.prototype, "tokenSubscription", null);
__decorate([
    (0, common_1.Get)('get-password-reset-link/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvestorController.prototype, "getPasswordResetLink", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], InvestorController.prototype, "changeYourPassword", null);
__decorate([
    (0, common_1.Get)('auth/resendOTP/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvestorController.prototype, "generateOTP", null);
__decorate([
    (0, common_1.Post)('verifyOTP'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_dto_1.OTPDto]),
    __metadata("design:returntype", void 0)
], InvestorController.prototype, "submitOTP", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.Get)('investor'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InvestorController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.Get)('investorByEmail'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InvestorController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Get)('get-one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvestorController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_investor_dto_1.UpdateInvestorDto]),
    __metadata("design:returntype", void 0)
], InvestorController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvestorController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('sendOTP'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mobile_dto_1.MobileDto]),
    __metadata("design:returntype", void 0)
], InvestorController.prototype, "sendtOTP", null);
__decorate([
    (0, common_1.Post)('verifySmsOTP'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [smsotp_dto_1.SmsOtpDto]),
    __metadata("design:returntype", void 0)
], InvestorController.prototype, "verifyOTP", null);
__decorate([
    (0, common_1.Get)('coins/marketdata'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InvestorController.prototype, "coins", null);
__decorate([
    (0, common_1.Get)('wallet-coins/marketdata'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InvestorController.prototype, "walletCoins", null);
__decorate([
    (0, common_1.Get)('inv/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvestorController.prototype, "getInvestorByEmail", null);
InvestorController = __decorate([
    (0, swagger_1.ApiTags)('Investor'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [investor_service_1.InvestorService,
        auth_service_1.AuthService])
], InvestorController);
exports.InvestorController = InvestorController;
//# sourceMappingURL=investor.controller.js.map