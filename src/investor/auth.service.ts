import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InvestorService } from './investor.service';
import { MailService } from './mail/mail.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './interface/jwt-payload.interface';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private investorService: InvestorService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signup(createInvestorDto: CreateInvestorDto) {
    const { userName, email, password } = createInvestorDto;

    const investors = await this.investorService.find(email);
    if (investors.length) {
      throw new BadRequestException('Email already in use');
    }

   
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    const hashedPassword: string = String(result);

    const investor =  await this.investorService.create(
      userName,
      email,
      hashedPassword,
    );

    const payload = { email: investor.email, isInvestor: true };
    const mail = investor.email;
    return {
      access_token: this.jwtService.sign(payload),
      mail
    };

  }

  async signin(email: string, password: string) {
    const [investor] = await this.investorService.find(email);
    if (!investor) {
      throw new NotFoundException('Investor not found');
    }

    const [salt, storedHash] = investor.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Email or Password is wrong');
    }

    const payload = { email: investor.email, isInvestor: true };
    const mail = investor.email;

    return {
      access_token: this.jwtService.sign(payload),
      mail
    };
  }


  // Validate Password
  async validatePassword(email: string, password: string){
    const [investor] = await this.investorService.find(email);
    const [salt, storedHash] = investor.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Incorrect password');
    }

    return true;
  }


  // Send Investor an email with the link to reset password
  async sendUserPasswordResetMail(email: string) {
    const [investor] = await this.investorService.find(email);
    if (!investor) throw new HttpException('Investor does not exists.', 404);

    const resetToken = randomBytes(16).toString('hex');
    
    const payload = {email, resetToken, isInvestor: true};
    const access_token = this.jwtService.sign(payload);

    await this.mailService.sendUserPasswordResetEMail(email, access_token);
  }



  // Reset the investor's password
  async resetPassword(resetToken: string, email:string, newPassword: string) {
    const [investor] = await this.investorService.find(email);
    if (!investor) throw new HttpException('Investor does not exists.', 404);
    
    if (investor.resetTokenIssuedAt + 300 < Math.floor(Date.now() / 1000))
      throw new HttpException('Invalid Token', 400);

    
    if (resetToken!= investor.resetToken) throw new BadRequestException();

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(newPassword, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    const hashedPassword: string = String(result);

    this.investorService.update(investor.id, {newPassword: hashedPassword});


    return 'Your password has been changed';
  }

  // Get Otp for verifying Email address of investor
  async getOTP(email:string){
    const validationCode = Math.floor(Math.random() * 1000000);
    return this.mailService.sendUserConfirmationMail(email, validationCode);
  }



  // Submit Otp to confirm the Investor's Email address
  async submitOTP(email: string, otp: number, timeStamp: number) {
    const [investor] = await this.investorService.find(email);

    if (investor.isConfirmed) throw new HttpException('Already Verified', 400);
    if (investor.otpIssuedAt + 300 < timeStamp)
      throw new HttpException('Invalid OTP', 400);

    if (investor.validationCode != otp)
      throw new HttpException('Wrong OTP', 400);

    const newIsConfirmed = true;
    
    await this.investorService.update(investor.id, {newIsConfirmed});
    return ' Investor Conirmed his/her Email';
  }

}
