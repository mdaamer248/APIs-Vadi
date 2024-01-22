import { HttpException, Injectable } from '@nestjs/common';
import { CreateInvestorProfileDto } from './dto/create-investor-profile.dto';
import { UpdateInvestorProfileDto } from './dto/update-investor-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestorProfile } from './entities/investor-profile.entity';
import { Investor } from 'src/investor/entities/investor.entity';
import { InvestorService } from 'src/investor/investor.service';

@Injectable()
export class InvestorProfileService {
  constructor(
    @InjectRepository(InvestorProfile)
    private investorProfileRepository: Repository<InvestorProfile>,
    private investorService: InvestorService,
  ) {}

  async create(
    createInvestorProfileDto: CreateInvestorProfileDto,
    email: string,
  ) {
    //createInvestorProfileDto.email = email;
    const investor = await this.investorService.findByEmail(email);
    const [profile] = await this.investorProfileRepository.find({
      where: { email },
    });
    if (!investor) {
      return { message: 'No registration found with this Email' };
    }
    if (!profile) {
      const prof = { investor, ...createInvestorProfileDto };
      const investorProfile = await this.investorProfileRepository.create(prof);
      investorProfile.email = email;
      await this.investorProfileRepository.save(investorProfile);
      return {
        investorProfile,
        message: 'profile created successfully',
      };
    } else {
      return { message: 'profile already created' };
    }
  }

  // Save Document name in investorProile
  async saveDoc(email: string, docName: string, type: string) {
    //console.log(email);
    const investorProfile = await this.findOne(email);
    if (type == 'front') investorProfile.idFront = docName;
    if (type == 'back') investorProfile.idBackSide = docName;
    if (type == 'address') investorProfile.addressDoc = docName;
    await this.investorProfileRepository.save(investorProfile);
    return { message: 'uploaded successfully' };
  }

  // return type of document related to the investor
  async getDocName(email: string, type: string) {
    const investorProfile = await this.findOne(email);
    let docName;
    if (type == 'front') docName = investorProfile.idFront;
    if (type == 'back') docName = investorProfile.idBackSide;
    if (type == 'address') docName = investorProfile.addressDoc;

    return docName;
  }

  // update idNumber of Investor
  async updateIdNumber(email: string, idNumber: string) {
    const investorProfile = await this.findOne(email);
    investorProfile.idNumber = idNumber;
    await this.investorProfileRepository.save(investorProfile);
    return investorProfile.idNumber;
  }

  // Get investor Level Details
  async getInvestorLevel(email: string) {
    const investorProfile = await this.findOne(email);
    const { fundAmount, totalAmountFunded } = investorProfile;
    return { fundAmount, totalAmountFunded };
  }

  findAll() {
    return `This action returns all investorProfile`;
  }

  async findOne(email: string) {
    const investorProfile = await this.investorProfileRepository.findOne({
      where: { email },
    });
    return investorProfile;
  }

  // Find by Email
  async findByEmail(email: string) {
    const investorProfile = await this.getProfileByEmail(email);
    return investorProfile;
  }

  ////// Get wallet by Email
  async getProfileByEmail(email: string) {
    const wallets = await this.investorProfileRepository.find({
      relations: ['investor'],
    });
    const investorEmail = email;
    let wallet;
    wallets.forEach((wall) => {
      if (wall.investor && wall.investor.email == investorEmail) wallet = wall;
    });
    return wallet;
  }
}
