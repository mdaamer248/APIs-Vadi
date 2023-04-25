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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const admin_auth_service_1 = require("./admin.auth.service");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const login_admin_dto_1 = require("./dto/login-admin.dto");
const resetpoasswird_dto_1 = require("./dto/resetpoasswird.dto");
const create_investor_dto_1 = require("../investor/dto/create-investor.dto");
const create_investor_profile_dto_1 = require("../investor-profile/dto/create-investor-profile.dto");
const investor_profile_service_1 = require("../investor-profile/investor-profile.service");
let AdminController = class AdminController {
    constructor(adminService, authService, investorProfileService) {
        this.adminService = adminService;
        this.authService = authService;
        this.investorProfileService = investorProfileService;
    }
    async signup(createAdminDto) {
        const admin = await this.authService.signup(createAdminDto);
        return admin;
    }
    async signin(loginAdminDto) {
        const admin = await this.authService.signin(loginAdminDto.email, loginAdminDto.password);
        return admin;
    }
    getPasswordResetLink(email) {
        return this.authService.sendUserPasswordResetMail(email);
    }
    changeYourPassword(body) {
        return this.authService.resetPassword(body.email, body.newPassword);
    }
    findAll() {
        return this.adminService.findAll();
    }
    async investorSignup(createInvestorDto) {
        const investor = await this.authService.investorSignup(createInvestorDto);
        return investor;
    }
    create(createInvestorProfileDto, email) {
        return this.investorProfileService.create(createInvestorProfileDto, email);
    }
    findAllInvestors() {
        return this.adminService.findAllInvestors();
    }
    removeInvestor(email) {
        return this.adminService.removeInvestor(email);
    }
    remove(email) {
        return this.adminService.remove(email);
    }
};
__decorate([
    (0, common_1.Post)('auth/signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('auth/signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_admin_dto_1.LoginAdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "signin", null);
__decorate([
    (0, common_1.Get)('get-password-reset-link/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPasswordResetLink", null);
__decorate([
    (0, common_1.Post)('reset-password/'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resetpoasswird_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "changeYourPassword", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('investor-registration'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_investor_dto_1.CreateInvestorDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "investorSignup", null);
__decorate([
    (0, common_1.Post)('create-investor-profile/:email'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_investor_profile_dto_1.CreateInvestorProfileDto, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/investorslist'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findAllInvestors", null);
__decorate([
    (0, common_1.Delete)('/delete-investor/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "removeInvestor", null);
__decorate([
    (0, common_1.Delete)('/delete-admin/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "remove", null);
AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        admin_auth_service_1.AuthService,
        investor_profile_service_1.InvestorProfileService])
], AdminController);
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map