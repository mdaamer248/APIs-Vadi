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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const util_1 = require("util");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const admin_entity_1 = require("./entities/admin.entity");
const investor_profile_entity_1 = require("../investor-profile/entities/investor-profile.entity");
const investor_entity_1 = require("../investor/entities/investor.entity");
const scrypt = (0, util_1.promisify)(crypto_1.scrypt);
let AdminService = class AdminService {
    constructor(adminRepository, investorProfileRepository, investorRepository) {
        this.adminRepository = adminRepository;
        this.investorProfileRepository = investorProfileRepository;
        this.investorRepository = investorRepository;
    }
    async create(userName, email, password) {
        try {
            const admin = { userName, email, password };
            const newAdmin = this.adminRepository.create(admin);
            await this.adminRepository.save(newAdmin);
            return newAdmin;
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Error creating Admin');
        }
    }
    async update(id, updateAdminDto) {
        const { newPassword, newEmail, newUserName, newResetToken, newResetTokenIssuedAt } = updateAdminDto;
        const admin = await this.findOne(id);
        if (!admin)
            throw new common_1.HttpException('Admin not found', common_1.HttpStatus.NOT_FOUND);
        if (newPassword)
            admin.password = newPassword;
        if (newEmail)
            admin.email = newEmail;
        if (newUserName)
            admin.userName = newUserName;
        if (newResetToken)
            admin.resetToken = newResetToken;
        if (newResetTokenIssuedAt)
            admin.resetTokenIssuedAt = newResetTokenIssuedAt;
        await this.adminRepository.save(admin);
        return `Admin  has been updated!`;
    }
    async findAll() {
        const admins = await this.adminRepository.find();
        if (!admins)
            throw new common_1.NotFoundException();
        return admins;
    }
    async findOne(id) {
        const admin = await this.adminRepository.findOne({ where: { id } });
        if (!admin)
            throw new common_1.NotFoundException();
        return admin;
    }
    async find(email) {
        const admin = await this.adminRepository.find({ where: { email } });
        if (!admin)
            throw new common_1.NotFoundException();
        return admin;
    }
    async remove(email) {
        const [admin] = await this.adminRepository.find({ where: { email } });
        await this.adminRepository.delete(admin.id);
        return admin;
    }
    async createInvestor(email, password) {
        try {
            const investor = { email, password };
            const newInvestor = this.investorRepository.create(investor);
            newInvestor.isConfirmed = true,
                await this.investorRepository.save(newInvestor);
            return newInvestor;
        }
        catch (err) {
            console.log('Error creating user', err);
            throw new common_1.InternalServerErrorException();
        }
    }
    async removeInvestor(email) {
        const [investor] = await this.investorRepository.find({ where: { email } });
        if (investor) {
            await this.investorRepository.delete(investor.id);
            return { message: "investor deleted successfully" };
        }
        else {
            return { message: "investor not found" };
        }
    }
    async findAllInvestors() {
        const query = this.investorProfileRepository.createQueryBuilder('pr');
        query
            .select([
            'i.id as investor_id,i.role,(i.is_confirmed) as isVerified,pr.*'
        ])
            .innerJoin('investor', 'i', 'pr.email = i.email')
            .groupBy('pr.id,i.id');
        const result = {
            count: await query.getCount(),
            data: await query.getRawMany(),
        };
        return result;
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __param(1, (0, typeorm_1.InjectRepository)(investor_profile_entity_1.InvestorProfile)),
    __param(2, (0, typeorm_1.InjectRepository)(investor_entity_1.Investor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map