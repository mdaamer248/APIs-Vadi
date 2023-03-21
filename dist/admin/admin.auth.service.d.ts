import { AdminService } from './admin.service';
import { JwtService } from '@nestjs/jwt';
import { CreateAdminDto } from './dto/create-admin.dto';
import { MailService } from './mail/mail.service';
import { CreateInvestorDto } from 'src/investor/dto/create-investor.dto';
import { InvestorService } from 'src/investor/investor.service';
export declare class AuthService {
    private adminService;
    private jwtService;
    private mailService;
    private investorService;
    constructor(adminService: AdminService, jwtService: JwtService, mailService: MailService, investorService: InvestorService);
    signup(createAdminDto: CreateAdminDto): Promise<{
        access_token: string;
        mail: string;
    }>;
    signin(email: string, password: string): Promise<{
        access_token: string;
        mail: string;
    }>;
    sendUserPasswordResetMail(email: string): Promise<void>;
    resetPassword(email: string, newPassword: string): Promise<{
        message: string;
    }>;
    investorSignup(createInvestorDto: CreateInvestorDto): Promise<{
        message: string;
        access_token?: undefined;
        mail?: undefined;
        id?: undefined;
    } | {
        access_token: string;
        message: string;
        mail: string;
        id: number;
    }>;
}
