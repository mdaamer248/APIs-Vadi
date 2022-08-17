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
  const scrypt = promisify(_scrypt);
  
  @Injectable()
  export class AuthService {
    constructor(
      private adminService: AdminService,
      private jwtService: JwtService,
      private mailService: MailService
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
  
      await this.mailService.sendUserPasswordResetEMail(email, access_token);
    }
  
  
  
    // Reset the admin's password
    async resetPassword(resetToken: string, email:string, newPassword: string) {
      const [admin] = await this.adminService.find(email);
      if (!admin) throw new HttpException('Investor does not exists.', 404);
      
      if (admin.resetTokenIssuedAt + 300 < Math.floor(Date.now() / 1000))
        throw new HttpException('Invalid Token', 400);
  
      
      if (resetToken!= admin.resetToken) throw new BadRequestException();
  
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(newPassword, salt, 32)) as Buffer;
      const result = salt + '.' + hash.toString('hex');
      const hashedPassword: string = String(result);
  
      this.adminService.update(admin.id, {newPassword: hashedPassword});
  
  
      return 'Your password has been changed';
    }
  
  }
  