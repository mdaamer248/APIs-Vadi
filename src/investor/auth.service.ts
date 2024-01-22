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
import { InvestorProfile } from 'src/investor-profile/entities/investor-profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investor } from './entities/investor.entity';
import { InvestorProfileService } from 'src/investor-profile/investor-profile.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private investorService: InvestorService,
    private jwtService: JwtService,
    private mailService: MailService, // private investorProfileService: InvestorProfileService,
  ) {}

  async signup(createInvestorDto: CreateInvestorDto) {
    const { email, password } = createInvestorDto;

    const [investors] = await this.investorService.find(email);
    if (investors) {
      return {
        message: 'Email already in use',
      };
      //throw new BadRequestException('Email already in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    const hashedPassword: string = String(result);

    const investor = await this.investorService.create(email, hashedPassword);
    if (investor) {
      const code = await this.getOTP(investor.email);

      const payload = { email: investor.email, isInvestor: true };
      const mail = investor.email;
      const id = investor.id;
      const access_token = this.jwtService.sign(payload);
      //const otp = code.verificationcode;
      return {
        access_token,
        message: 'Success,Verification code has been sent to your Mail',
        mail,
        id,
      };
    }
  }

  async signin(email: string, password: string) {
    const [investor] = await this.investorService.find(email);
    // const profile = await this.investorProfileService.findByEmail(email);
    // console.log(profile);

    if (!investor) {
      return {
        message: 'User not found with this Email',
      };
      //throw new NotFoundException('User not found with this email');
    }

    const [salt, storedHash] = investor.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      return {
        message: 'Email or Password is wrong',
      };
      //throw new BadRequestException('Email or Password is wrong');
    }

    const payload = { email: investor.email, isInvestor: true };
    const mail = investor.email;
    const id = investor.id;
    const isVerified = investor.isConfirmed;
    const isTokenSubscribed = investor.isTokenSubscribed;

    const isProfileCompleted =
      investor.investorProfile && isVerified == true
        ? investor.investorProfile.isProfileCompleted
        : false;

    return {
      access_token: this.jwtService.sign(payload),
      message: 'Login Success',
      isVerified,
      isProfileCompleted,
      isTokenSubscribed,
      mail,
      id,
    };
  }

  // Validate Password
  async validatePassword(email: string, password: string) {
    const [investor] = await this.investorService.find(email);
    if (!investor) return { message: 'No registration found with this Email' };
    const [salt, storedHash] = investor.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      return {
        message: 'Incorrect password',
      };
      //throw new BadRequestException('Incorrect password');
    }

    return { message: 'success ' };
  }

  //update token subscription status
  async tokenSubscription(email: string) {
    const [investor] = await this.investorService.find(email);
    if (!investor) return { message: 'No registration found with this Email' };
    if (investor.isTokenSubscribed == true) {
      console.log(investor);
      return {
        message: 'Already subscribed',
      };
    } else {
      investor.isTokenSubscribed = true;
      await this.investorService.update(investor.id, investor);
      console.log(investor);
      return { message: 'subscription success ' };
    }
  }

  // Send Investor an email with the link to reset password
  async sendUserPasswordResetMail(email: string) {
    const [investor] = await this.investorService.find(email);
    if (!investor) return { message: 'User does not exists.' };
    //const resetToken = randomBytes(16).toString('hex');

    //const payload = {email, resetToken, isInvestor: true};
    //const access_token = this.jwtService.sign(payload);

    const { resetTokenIssuedAt, ...result } =
      await this.mailService.sendUserPasswordResetEMail(investor, email);
    await this.investorService.update(investor.id, { resetTokenIssuedAt });
    return result;
  }

  // Reset the investor's password
  async resetPassword(email: string, password: string) {
    const [investor] = await this.investorService.find(email);
    if (!investor) return { message: 'User does not exists.' };

    this.investorService.update(investor.id, { password });

    return {
      message: 'Your password has been changed',
    };
  }

  // Get Otp for verifying Email address of investor
  async getOTP(email: string) {
    const investor = await this.investorService.findByEmail(email);
    const validationCode = Math.floor(Math.random() * 1000000);
    const { otpIssuedAt, ...result } =
      await this.mailService.sendUserConfirmationMail(investor, validationCode);
    await this.investorService.update(investor.id, {
      validationCode,
      otpIssuedAt,
    });
    return result;
  }

  // Submit Otp to confirm the Investor's Email address
  async submitOTP(email: string, otp: number) {
    const [investor] = await this.investorService.find(email);

    if (!investor) return { message: 'User not found with this Email' };
    if (investor.isConfirmed) return { message: 'Already Verified' };
    // if (investor.otpIssuedAt + 300 < timeStamp)
    //   return { message:'Invalid OTP' }

    if (investor.validationCode != otp) return { message: 'Wrong OTP' };

    const isConfirmed = true;

    await this.investorService.update(investor.id, { isConfirmed });
    return {
      message: 'User Confirmed his/her Email',
    };
  }
}
