import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InvestorProfile } from 'src/investor-profile/entities/investor-profile.entity';
import { Investor } from 'src/investor/entities/investor.entity';
export declare class AdminService {
    private adminRepository;
    private investorProfileRepository;
    private investorRepository;
    constructor(adminRepository: Repository<Admin>, investorProfileRepository: Repository<InvestorProfile>, investorRepository: Repository<Investor>);
    create(userName: string, email: string, password: string): Promise<Admin>;
    update(id: number, updateAdminDto: UpdateAdminDto): Promise<string>;
    findAll(): Promise<Admin[]>;
    findOne(id: number): Promise<Admin>;
    find(email: string): Promise<Admin[]>;
    remove(email: string): Promise<Admin>;
    createInvestor(email: string, password: string): Promise<Investor>;
    removeInvestor(email: string): Promise<{
        message: string;
    }>;
    findAllInvestors(): Promise<{
        count: number;
        data: any[];
    }>;
}
