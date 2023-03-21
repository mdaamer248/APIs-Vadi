import { InvestorService } from './investor.service';
import { MailService } from './mail/mail.service';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private investorService;
    private jwtService;
    private mailService;
    constructor(investorService: InvestorService, jwtService: JwtService, mailService: MailService);
    signup(createInvestorDto: CreateInvestorDto): Promise<{
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
    signin(email: string, password: string): Promise<{
        message: string;
        access_token?: undefined;
    } | {
        access_token: string;
        message: string;
    }>;
    validatePassword(email: string, password: string): Promise<{
        message: string;
    }>;
    tokenSubscription(email: string): Promise<{
        message: string;
    }>;
    sendUserPasswordResetMail(email: string): Promise<{
        code: number;
        message: string;
        email: string;
    } | {
        message: string;
    }>;
    resetPassword(email: string, password: string): Promise<{
        message: string;
    }>;
    getOTP(email: string): Promise<{
        code: number;
        message: string;
        verificationcode: number;
    }>;
    submitOTP(email: string, otp: number): Promise<{
        message: string;
    }>;
}
