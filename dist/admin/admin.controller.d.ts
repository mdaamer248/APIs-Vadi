import { AdminService } from './admin.service';
import { AuthService } from './admin.auth.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ResetPasswordDto } from './dto/resetpoasswird.dto';
import { CreateInvestorDto } from 'src/investor/dto/create-investor.dto';
import { CreateInvestorProfileDto } from 'src/investor-profile/dto/create-investor-profile.dto';
import { InvestorProfileService } from 'src/investor-profile/investor-profile.service';
export declare class AdminController {
    private readonly adminService;
    private authService;
    private investorProfileService;
    constructor(adminService: AdminService, authService: AuthService, investorProfileService: InvestorProfileService);
    signup(createAdminDto: CreateAdminDto): Promise<{
        access_token: string;
        mail: string;
    }>;
    signin(loginAdminDto: LoginAdminDto): Promise<{
        access_token: string;
        mail: string;
    }>;
    getPasswordResetLink(email: string): Promise<void>;
    changeYourPassword(body: ResetPasswordDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./entities/admin.entity").Admin[]>;
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
    create(createInvestorProfileDto: CreateInvestorProfileDto, email: string): Promise<{
        message: string;
        investorProfile?: undefined;
    } | {
        investorProfile: import("../investor-profile/entities/investor-profile.entity").InvestorProfile;
        message: string;
    }>;
    findAllInvestors(): Promise<{
        count: number;
        data: any[];
    }>;
    removeInvestor(email: string): Promise<{
        message: string;
    }>;
    remove(email: string): Promise<import("./entities/admin.entity").Admin>;
}
