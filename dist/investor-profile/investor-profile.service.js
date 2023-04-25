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
exports.InvestorProfileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const investor_profile_entity_1 = require("./entities/investor-profile.entity");
const investor_service_1 = require("../investor/investor.service");
let InvestorProfileService = class InvestorProfileService {
    constructor(investorProfileRepository, investorService) {
        this.investorProfileRepository = investorProfileRepository;
        this.investorService = investorService;
    }
    async create(createInvestorProfileDto, email) {
        const investor = await this.investorService.findByEmail(email);
        const [profile] = await this.investorProfileRepository.find({ where: { email } });
        if (!investor) {
            return { message: 'No registration found with this Email' };
        }
        if (!profile) {
            const prof = Object.assign({ investor }, createInvestorProfileDto);
            const investorProfile = await this.investorProfileRepository.create(prof);
            investorProfile.email = email;
            await this.investorProfileRepository.save(investorProfile);
            return {
                investorProfile,
                message: 'profile created successfully'
            };
        }
        else {
            return { message: "profile already created" };
        }
    }
    async saveDoc(email, docName, type) {
        const investorProfile = await this.findOne(email);
        if (type == 'front')
            investorProfile.idFront = docName;
        if (type == 'back')
            investorProfile.idBackSide = docName;
        if (type == 'address')
            investorProfile.addressDoc = docName;
        await this.investorProfileRepository.save(investorProfile);
        return { message: 'uploaded successfully' };
    }
    async getDocName(email, type) {
        const investorProfile = await this.findOne(email);
        let docName;
        if (type == 'front')
            docName = investorProfile.idFront;
        if (type == 'back')
            docName = investorProfile.idBackSide;
        if (type == 'address')
            docName = investorProfile.addressDoc;
        return docName;
    }
    async updateIdNumber(email, idNumber) {
        const investorProfile = await this.findOne(email);
        investorProfile.idNumber = idNumber;
        await this.investorProfileRepository.save(investorProfile);
        return investorProfile.idNumber;
    }
    async getInvestorLevel(email) {
        const investorProfile = await this.findOne(email);
        const { fundAmount, totalAmountFunded } = investorProfile;
        return { fundAmount, totalAmountFunded };
    }
    findAll() {
        return `This action returns all investorProfile`;
    }
    async findOne(email) {
        const investorProfile = await this.getProfileByEmail(email);
        return investorProfile;
    }
    async findByEmail(email) {
        const investorProfile = await this.getProfileByEmail(email);
        return investorProfile;
    }
    async getProfileByEmail(email) {
        const wallets = await this.investorProfileRepository.find({ relations: ['investor'] });
        const investorEmail = email;
        let wallet;
        wallets.forEach((wall) => {
            if (wall.investor && wall.investor.email == investorEmail)
                wallet = wall;
        });
        return wallet;
    }
};
InvestorProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(investor_profile_entity_1.InvestorProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        investor_service_1.InvestorService])
], InvestorProfileService);
exports.InvestorProfileService = InvestorProfileService;
//# sourceMappingURL=investor-profile.service.js.map