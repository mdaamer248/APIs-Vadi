import { HttpException, Injectable } from '@nestjs/common';
import { CreateInvestorProfileDto } from './dto/create-investor-profile.dto';
import { UpdateInvestorProfileDto } from './dto/update-investor-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestorProfile } from './entities/investor-profile.entity';

@Injectable()
export class InvestorProfileService {

  constructor(@InjectRepository(InvestorProfile) private investorProfileRepository: Repository<InvestorProfile>){}

  async create(createInvestorProfileDto: CreateInvestorProfileDto, email: string) {
    //createInvestorProfileDto.email = email;
    const [profile] = await this.investorProfileRepository.find({where:{email}});
    
    if(!profile){ 
  
      const investorProfile = await this.investorProfileRepository.create(createInvestorProfileDto);
      investorProfile.email = email;
      await this.investorProfileRepository.save(investorProfile);
      return {
        investorProfile,
        message: 'profile created successfully'
      }
    }
    else{
      return { message:"profile already created"}
    }
  }


  // Save Document name in investorProile
  async saveDoc(email: string, docName: string, type: string){
    const investorProfile = await this.findOne(email);
    if(type == 'front') investorProfile.idFront = docName;
    if(type == 'back') investorProfile.idBackSide = docName;
    if(type == 'address') investorProfile.addressDoc = docName;
    await this.investorProfileRepository.save(investorProfile);
    return investorProfile;
  }


  // return type of document related to the investor
  async getDocName(email: string, type: string){
    const investorProfile = await this.findOne(email);
    let docName;
    if(type == 'front')   docName =   investorProfile.idFront      ;
    if(type == 'back')    docName =   investorProfile.idBackSide   ;
    if(type == 'address') docName =   investorProfile.addressDoc   ;
    
    return docName;
  }

  // update idNumber of Investor
  async updateIdNumber(email: string, idNumber: string){
    const investorProfile = await this.findOne(email);
    investorProfile.idNumber = idNumber;
    await this.investorProfileRepository.save(investorProfile);
    return investorProfile.idNumber;
  }

  // Get investor Level Details
  async getInvestorLevel(email: string){
    const investorProfile = await this.findOne(email);
    const { fundAmount, totalAmountFunded} = investorProfile;
    return {fundAmount, totalAmountFunded};
  }

  findAll() {
    return `This action returns all investorProfile`;
  }

  async findOne(email: string) {
    const [investorProfile] = await this.investorProfileRepository.find({where:{email}})
    if(!investorProfile) throw new HttpException("Pofile Not Found",404);
    return investorProfile;
  }

  update(id: number, updateInvestorProfileDto: UpdateInvestorProfileDto) {
    return `This action updates a #${id} investorProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} investorProfile`;
  }
}
