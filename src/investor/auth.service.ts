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

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private investorService: InvestorService,
    private jwtService: JwtService,
    private mailService: MailService,
    @InjectRepository(InvestorProfile) 
    private investorProfileRepository: Repository<InvestorProfile>
  ) {}

  async signup(createInvestorDto: CreateInvestorDto) {
    const {email, password, refferalCode, role } = createInvestorDto;

    const [investors] = await this.investorService.find(email);
    if (investors) {
 
      if(investors.isConfirmed == true){
      return {
        message: 'Email already in use' 
      }
     }else{
      return {message: 'Please verify your Account'}
     }
      //throw new BadRequestException('Email already in use');
    }

   
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    const hashedPassword: string = String(result);

    const investor =  await this.investorService.create(
      email,
      hashedPassword,
      refferalCode,
      role
    );
    if(investor) {
      const code = await this.getOTP(investor.email)

      const payload = { email: investor.email, isInvestor: true };
      const mail = investor.email;
      const id = investor.id;
      //const otp = code.verificationcode;
    return {
      access_token: this.jwtService.sign(payload),
      message:"Success,Verification code has been sent to your Mail",
      mail,
      id
    };
  }

  }

  async signin(email: string, password: string) {
    const [investor] = await this.investorService.find(email);
    const [profile] = await this.investorProfileRepository.find({where:{email}});
    console.log(profile);

    if (!investor) {
      return {
        message: 'User not found with this Email'
      }
      //throw new NotFoundException('User not found with this email');
    }

    const [salt, storedHash] = investor.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {

      return {
        message: 'Email or Password is wrong'
      }
      //throw new BadRequestException('Email or Password is wrong');
    }

    const payload = { email: investor.email, isInvestor: true };
    const mail = investor.email;
    const id = investor.id;
    const isVerified = investor.isConfirmed;
    if(profile && isVerified == true){
     const isProfileCompleted = profile.isProfileCompleted;
      
        return {
         access_token: this.jwtService.sign(payload),
         message:"Login Success",
         isVerified,
         mail,
         id,
         isProfileCompleted
        };
      }
       else{
        const isProfileCompleted = false;
        return{
        //access_token: this.jwtService.sign(payload),
        message:"Login Success",
        isVerified,
        isProfileCompleted
         }
      }
  }


  // Validate Password
  async validatePassword(email: string, password: string){
    const [investor] = await this.investorService.find(email);
    const [salt, storedHash] = investor.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      return {
        mesage:'Incorrect password'
      }
      //throw new BadRequestException('Incorrect password');
    }

    return true;
  }


  // Send Investor an email with the link to reset password
  async sendUserPasswordResetMail(email: string) {
    const [investor] = await this.investorService.find(email);
    if (!investor) return { message:'User does not exists.'}
    {nullable: true}
    const resetToken = randomBytes(16).toString('hex');
    
    const payload = {email, resetToken, isInvestor: true};
    const access_token = this.jwtService.sign(payload);

    const result = await this.mailService.sendUserPasswordResetEMail(email, access_token);
    return result;
  }



  // Reset the investor's password
  async resetPassword(resetToken: string, email:string, newPassword: string) {
    const [investor] = await this.investorService.find(email);
    if (!investor) return { message:'User does not exists.'}
    
    if (investor.resetTokenIssuedAt + 300 < Math.floor(Date.now() / 1000))
      return { message: 'Invalid token' }

    
    if (resetToken!= investor.resetToken) throw new BadRequestException();

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(newPassword, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    const hashedPassword: string = String(result);

    this.investorService.update(investor.id, {newPassword: hashedPassword});


    return {
      message:'Your password has been changed'
    }
  }

  // Get Otp for verifying Email address of investor
  async getOTP(email:string){
    const validationCode = Math.floor(Math.random() * 1000000);
    return this.mailService.sendUserConfirmationMail(email, validationCode);
  }



  // Submit Otp to confirm the Investor's Email address
  async submitOTP(email: string, otp: number, timeStamp: number) {
    const [investor] = await this.investorService.find(email);

    if (investor.isConfirmed) return {message: 'Already Verified' }
    if (investor.otpIssuedAt + 300 < timeStamp)
      return { message:'Invalid OTP' }

    if (investor.validationCode != otp)
      return { message: 'Wrong OTP' }

    const newIsConfirmed = true;
    
    await this.investorService.update(investor.id, {newIsConfirmed});
    return {
      message: 'User Confirmed his/her Email'
    }
  }

}
