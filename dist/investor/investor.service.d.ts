import { Repository } from 'typeorm';
import { Investor } from './entities/investor.entity';
import { User } from './entities/user.entity';
import { MobileDto } from './dto/mobile.dto';
import { ConfigService } from '@nestjs/config';
export declare class InvestorService {
    private investorRepository;
    private userRepository;
    private configService;
    private vonage;
    constructor(investorRepository: Repository<Investor>, userRepository: Repository<User>, configService: ConfigService);
    create(email: string, password: string): Promise<Investor>;
    update(id: number, updateInvestorDto: any): Promise<Investor>;
    genPasswordHash(pass: string): Promise<string>;
    findAll(): Promise<Investor[]>;
    findOne(id: number): Promise<Investor>;
    findByEmail(email: string): Promise<any>;
    sendOTP(dto: MobileDto): Promise<{
        code: number;
        message: any;
    }>;
    sendSMS: (from: any, to: any, text: any) => Promise<unknown>;
    verifyOTP(mobile: number, otp: number): Promise<{
        code: number;
        message: string;
    }>;
    find(email: string): Promise<Investor[]>;
    remove(id: number): string;
    marketdata(): Promise<{
        message: string;
        result: any;
    }>;
    walletMarketdata(): Promise<{
        message: string;
        result: any;
    }>;
}
