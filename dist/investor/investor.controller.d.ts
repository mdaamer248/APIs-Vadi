import { InvestorService } from './investor.service';
import { AuthService } from './auth.service';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';
import { LoginInvestorDto } from './dto/login-investor.dto';
import { OTPDto } from './dto/otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordDto } from './dto/password.dto';
import { MobileDto } from './dto/mobile.dto';
import { SmsOtpDto } from './dto/smsotp.dto';
export declare class InvestorController {
    private readonly investorService;
    private authService;
    constructor(investorService: InvestorService, authService: AuthService);
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
    signin(loginInvestorDto: LoginInvestorDto): Promise<{
        message: string;
        access_token?: undefined;
    } | {
        access_token: string;
        message: string;
    }>;
    validatePassword(email: string, data: PasswordDto): Promise<{
        message: string;
    }>;
    tokenSubscription(email: string): Promise<{
        message: string;
    }>;
    getPasswordResetLink(email: string): Promise<{
        code: number;
        message: string;
        email: string;
    } | {
        message: string;
    }>;
    changeYourPassword(body: ResetPasswordDto): Promise<{
        message: string;
    }>;
    generateOTP(email: string): Promise<{
        code: number;
        message: string;
        verificationcode: number;
    }>;
    submitOTP(data: OTPDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/investor.entity").Investor[]>;
    findByEmail(req: any): Promise<any>;
    findOne(id: string): Promise<import("./entities/investor.entity").Investor>;
    update(id: string, updateInvestorDto: UpdateInvestorDto): Promise<import("./entities/investor.entity").Investor>;
    remove(id: string): string;
    sendtOTP(phone: MobileDto): Promise<{
        code: number;
        message: any;
    }>;
    verifyOTP(data: SmsOtpDto): Promise<{
        code: number;
        message: string;
    }>;
    coins(): Promise<{
        message: string;
        result: any;
    }>;
    walletCoins(): Promise<{
        message: string;
        result: any;
    }>;
    getInvestorByEmail(email: string): Promise<any>;
}
