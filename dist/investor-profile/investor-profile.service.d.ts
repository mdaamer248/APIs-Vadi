import { CreateInvestorProfileDto } from './dto/create-investor-profile.dto';
import { Repository } from 'typeorm';
import { InvestorProfile } from './entities/investor-profile.entity';
import { InvestorService } from 'src/investor/investor.service';
export declare class InvestorProfileService {
    private investorProfileRepository;
    private investorService;
    constructor(investorProfileRepository: Repository<InvestorProfile>, investorService: InvestorService);
    create(createInvestorProfileDto: CreateInvestorProfileDto, email: string): Promise<{
        message: string;
        investorProfile?: undefined;
    } | {
        investorProfile: InvestorProfile;
        message: string;
    }>;
    saveDoc(email: string, docName: string, type: string): Promise<{
        message: string;
    }>;
    getDocName(email: string, type: string): Promise<any>;
    updateIdNumber(email: string, idNumber: string): Promise<any>;
    getInvestorLevel(email: string): Promise<{
        fundAmount: any;
        totalAmountFunded: any;
    }>;
    findAll(): string;
    findOne(email: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    getProfileByEmail(email: string): Promise<any>;
}
