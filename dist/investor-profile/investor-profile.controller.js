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
exports.InvestorProfileController = void 0;
const common_1 = require("@nestjs/common");
const investor_profile_service_1 = require("./investor-profile.service");
const create_investor_profile_dto_1 = require("./dto/create-investor-profile.dto");
const swagger_1 = require("@nestjs/swagger");
const get_by_email_dto_1 = require("./dto/get-by-email.dto");
const common_2 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const id_number_dto_1 = require("./dto/id-number.dto");
const file_storage_utils_1 = require("./utils/file-storage.utils");
const rxjs_1 = require("rxjs");
const path_1 = require("path");
const investor_guard_1 = require("../guards/investor.guard");
let InvestorProfileController = class InvestorProfileController {
    constructor(investorProfileService) {
        this.investorProfileService = investorProfileService;
    }
    create(createInvestorProfileDto, email) {
        return this.investorProfileService.create(createInvestorProfileDto, email);
    }
    async updateIdNumber(data, req) {
        const email = req.token.email;
        const investorIdNumber = await this.investorProfileService.updateIdNumber(email, data.idNumber);
        return investorIdNumber;
    }
    async getInvestorLevel(req) {
        const email = req.token.email;
        const investorLevelDetails = await this.investorProfileService.getInvestorLevel(email);
        return investorLevelDetails;
    }
    async uploadFile(file, email) {
        const investorProfile = await this.investorProfileService.saveDoc(email, file.filename, 'front');
        return investorProfile;
    }
    async uploadFileBack(file, email) {
        const investorProfile = await this.investorProfileService.saveDoc(email, file.filename, 'back');
        return investorProfile;
    }
    async uploadFileAddress(file, email) {
        const investorProfile = await this.investorProfileService.saveDoc(email, file.filename, 'address');
        return investorProfile;
    }
    async findProfileImage(imagename, res, req) {
        const email = req.token.email;
        const imageName = await this.investorProfileService.getDocName(email, imagename);
        return (0, rxjs_1.of)(res.sendFile((0, path_1.join)(process.cwd(), 'uploads/profileimages/' + imageName)));
    }
    findAll() {
        return this.investorProfileService.findAll();
    }
    getByEmail(data) {
        return this.investorProfileService.findOne(data.email);
    }
};
__decorate([
    (0, common_1.Post)('create/:email'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_investor_profile_dto_1.CreateInvestorProfileDto, String]),
    __metadata("design:returntype", void 0)
], InvestorProfileController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_2.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.Post)('update-idNumber'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_number_dto_1.IdNumberDto, Object]),
    __metadata("design:returntype", Promise)
], InvestorProfileController.prototype, "updateIdNumber", null);
__decorate([
    (0, common_1.Get)('get-investor-level'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestorProfileController.prototype, "getInvestorLevel", null);
__decorate([
    (0, common_1.Post)('file/upload/idFront/:email'),
    (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', file_storage_utils_1.storage)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvestorProfileController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('file/upload/idBackSide/:email'),
    (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', file_storage_utils_1.storage)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvestorProfileController.prototype, "uploadFileBack", null);
__decorate([
    (0, common_1.Post)('file/upload/idAddress/:email'),
    (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', file_storage_utils_1.storage)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvestorProfileController.prototype, "uploadFileAddress", null);
__decorate([
    (0, common_1.Get)('profile-image/:imagename'),
    __param(0, (0, common_1.Param)('imagename')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], InvestorProfileController.prototype, "findProfileImage", null);
__decorate([
    (0, common_1.Get)('get-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InvestorProfileController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('get-by-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_by_email_dto_1.GetByEmailDto]),
    __metadata("design:returntype", void 0)
], InvestorProfileController.prototype, "getByEmail", null);
InvestorProfileController = __decorate([
    (0, swagger_1.ApiTags)('Profile'),
    (0, common_1.Controller)('profile'),
    __metadata("design:paramtypes", [investor_profile_service_1.InvestorProfileService])
], InvestorProfileController);
exports.InvestorProfileController = InvestorProfileController;
//# sourceMappingURL=investor-profile.controller.js.map