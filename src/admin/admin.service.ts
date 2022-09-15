import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InvestorProfile } from 'src/investor-profile/entities/investor-profile.entity';
import { Investor } from 'src/investor/entities/investor.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(InvestorProfile) 
    private investorProfileRepository: Repository<InvestorProfile>,
    @InjectRepository(Investor) 
    private investorRepository: Repository<Investor>,
  ) {}

  // Create the Admin and save it to the repository.
  async create(userName: string, email: string, password: string) {
    try {
      const admin = { userName, email, password };
      const newAdmin = this.adminRepository.create(admin);
      await this.adminRepository.save(newAdmin);
      return newAdmin;
    } catch (err) {
      throw new InternalServerErrorException('Error creating Admin');
    }
  }

  // Update the Investor and save it to Repository
  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const {
      newPassword,
      newEmail,
      newUserName,
      newResetToken,
      newResetTokenIssuedAt
    } = updateAdminDto;
    const admin = await this.findOne(id);
    if (!admin)
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);

    if (newPassword) admin.password = newPassword;
    if (newEmail) admin.email = newEmail;
    if (newUserName) admin.userName = newUserName;
    if (newResetToken)  admin.resetToken = newResetToken;
    if (newResetTokenIssuedAt) admin.resetTokenIssuedAt = newResetTokenIssuedAt;
    
    await this.adminRepository.save(admin);
    return `Admin  has been updated!`;
  }

  // Get all the admins
  async findAll() {
    const admins = await this.adminRepository.find();
    if (!admins) throw new NotFoundException();
    return admins;
  }

  // Find the admin by Id
  async findOne(id: number) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) throw new NotFoundException();
    return admin;
  }

  // Find the admin by Email
  async find(email: string) {
    const admin = await this.adminRepository.find({ where: { email } });
    if (!admin) throw new NotFoundException();
    return admin;
  }

  // Delete the!admin by Id
  async remove(email: string) {
    const [admin] = await this.adminRepository.find({ where: { email } });
     await this.adminRepository.delete(admin.id);
    return admin;
  }
//Delete investor
  async removeInvestor(email: string) {
    const [investor] = await this.investorRepository.find({ where: { email } });
    if(investor){
     await this.investorRepository.delete(investor.id);
     return { message: "investor deleted successfully"}
    }else{
      return { message:"investor not found"}
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
}
