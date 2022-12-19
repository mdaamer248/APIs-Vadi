import {
    Injectable,
    BadRequestException,
    NotFoundException,
    HttpException
  } from '@nestjs/common';
  import { randomBytes, scrypt as _scrypt } from 'crypto';
  import { AdminService } from './admin.service';
  import { promisify } from 'util';
  import { JwtService } from '@nestjs/jwt';
  import { CreateAdminDto } from './dto/create-admin.dto';
  import { MailService } from './mail/mail.service';
  import { CreateInvestorDto } from 'src/investor/dto/create-investor.dto';
  import { InvestorService } from 'src/investor/investor.service';

  const scrypt = promisify(_scrypt);
  
  
  @Injectable()
  export class AuthService {
    constructor(
      private adminService: AdminService,
      private jwtService: JwtService,
      private mailService: MailService,
      private investorService: InvestorService

    ) {}
  
    async signup(createAdminDto: CreateAdminDto) {
      const { userName, email, password } = createAdminDto;
      const admin = await this.adminService.find(email);
      if (admin.length) {
        throw new BadRequestException('Email already in use');
      }
  
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      const result = salt + '.' + hash.toString('hex');
      const hashedPassword: string = String(result);
  
      const newAdmin =  await this.adminService.create(
        userName,
        email,
        hashedPassword,
      );
  
      const payload = { email: newAdmin.email, isInvestor: true };
      const mail = newAdmin.email;
      return {
        access_token: this.jwtService.sign(payload),
        mail
      };
  
    }
  
    async signin(email: string, password: string) {
      const [admin] = await this.adminService.find(email);
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
  
      const [salt, storedHash] = admin.password.split('.');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      if (storedHash !== hash.toString('hex')) {
        throw new BadRequestException('Email or Password is wrong');
      }
  
      const payload = { email: admin.email, isInvestor: true };
      const mail = admin.email;
  
      return {
        access_token: this.jwtService.sign(payload),
        mail
      };
    }
  
  
    // Send Investor an email with the link to reset password
    async sendUserPasswordResetMail(email: string) {
      const [admin] = await this.adminService.find(email);
      if (!admin) throw new HttpException('Admin does not exists.', 404);
  
      const resetToken = randomBytes(16).toString('hex');
      
      const payload = {email, resetToken, isInvestor: true};
      const access_token = this.jwtService.sign(payload);
  
      await this.mailService.sendUserPasswordResetEMail(email);
    }
  
  
  
    // Reset the admin's password
    async resetPassword(email:string, newPassword: string) {
      const [admin] = await this.adminService.find(email);
      if (!admin) return { message:'Admin does not exists.'};
      
      // if (admin.resetTokenIssuedAt + 300 < Math.floor(Date.now() / 1000))
      //   throw new HttpException('Invalid Token', 400);
      //if (resetToken!= admin.resetToken) throw new BadRequestException();
  
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(newPassword, salt, 32)) as Buffer;
      const result = salt + '.' + hash.toString('hex');
      const hashedPassword: string = String(result);
  
      this.adminService.update(admin.id, {newPassword: hashedPassword});
      return { message: 'Your password has been changed'};
    }

    // Investor registration by admin
    async investorSignup(createInvestorDto: CreateInvestorDto) {
      const {email, password} = createInvestorDto;
  
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
  
      const investor =  await this.adminService.createInvestor(
        email,
        hashedPassword
      );
      if(investor) {
        //const code = await this.getOTP(investor.email)
  
        const payload = { email: investor.email, isInvestor: true };
        const mail = investor.email;
        const id = investor.id;
        //const otp = code.verificationcode;
      return {
        access_token: this.jwtService.sign(payload),
        message:"Success",
        mail,
        id
      };
    }
  
    }
  
  }
  