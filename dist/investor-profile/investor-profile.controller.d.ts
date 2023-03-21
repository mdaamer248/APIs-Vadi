import { InvestorProfileService } from './investor-profile.service';
import { CreateInvestorProfileDto } from './dto/create-investor-profile.dto';
import { GetByEmailDto } from './dto/get-by-email.dto';
import { IdNumberDto } from './dto/id-number.dto';
import { Observable } from 'rxjs';
export declare class InvestorProfileController {
    private readonly investorProfileService;
    constructor(investorProfileService: InvestorProfileService);
    create(createInvestorProfileDto: CreateInvestorProfileDto, email: string): Promise<{
        message: string;
        investorProfile?: undefined;
    } | {
        investorProfile: import("./entities/investor-profile.entity").InvestorProfile;
        message: string;
    }>;
    updateIdNumber(data: IdNumberDto, req: any): Promise<any>;
    getInvestorLevel(req: any): Promise<{
        fundAmount: any;
        totalAmountFunded: any;
    }>;
    uploadFile(file: any, email: string): Promise<{
        message: string;
    }>;
    uploadFileBack(file: any, email: string): Promise<{
        message: string;
    }>;
    uploadFileAddress(file: any, email: string): Promise<{
        message: string;
    }>;
    findProfileImage(imagename: any, res: any, req: any): Promise<Observable<Object>>;
    findAll(): string;
    getByEmail(data: GetByEmailDto): Promise<any>;
}
