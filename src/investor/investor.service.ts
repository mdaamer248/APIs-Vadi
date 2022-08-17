import { Injectable } from '@nestjs/common';
import { UpdateInvestorDto } from './dto/update-investor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investor } from './entities/investor.entity';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class InvestorService {
  constructor(
    @InjectRepository(Investor)
    private investorRepository: Repository<Investor>) {}


  // Create the Investor and save it to the repository.
  async create(userName: string, email: string, password: string) {
    try {
      const investor = { userName, email, password };
      const newInvestor = this.investorRepository.create(investor);
      await this.investorRepository.save(newInvestor);
      return newInvestor;
    } catch (err) {
      console.log('Error creating Investor', err);
      throw new InternalServerErrorException();
    }
  }

  // Update the Investor and save it to Repository
  async update(id: number, updateInvestorDto: UpdateInvestorDto) {
    const {
      newPassword,
      newEmail,
      newUserName,
      newValidationCode,
      newOtpIssuedAt,
      newResetToken,
      newResetTokenIssuedAt,
      newIsConfirmed
    } = updateInvestorDto;
    const investor = await this.findOne(id);
    if (!investor)
      throw new HttpException('Investor not found', HttpStatus.NOT_FOUND);

    if (newPassword) investor.password = newPassword;
    if (newEmail) investor.email = newEmail;
    if (newUserName) investor.userName = newUserName;
    if (newValidationCode) investor.validationCode = newValidationCode;
    if (newOtpIssuedAt) investor.otpIssuedAt = newOtpIssuedAt;
    if (newResetToken)  investor.resetToken = newResetToken;
    if (newResetTokenIssuedAt) investor.resetTokenIssuedAt = newResetTokenIssuedAt;
    if (newIsConfirmed) investor.isConfirmed = true;

    await this.investorRepository.save(investor);
    return `Investor ${investor.email} has been updated!`;
  }


  // Get all Investor
  async findAll() {
    const investors = await this.investorRepository.find();
    if (!investors) throw new NotFoundException();
    return investors;
  }


  // Find the Investor By Id
  async findOne(id: number) {
    const investor = await this.investorRepository.findOne({ where: { id } });
    if (!investor) throw new NotFoundException();
    return investor;
  }

  


  // Find the investor by Email
  find(email: string) {
    return this.investorRepository.find({ where: { email } });
  }

  // Delete the investor by Id
  remove(id: number) {
    return `This action removes a #${id} investor`;
  }
}
