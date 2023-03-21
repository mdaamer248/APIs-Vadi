import { ConfigService } from '@nestjs/config';
import { InvestorService } from 'src/investor/investor.service';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
export declare class WalletService {
    private walletRepository;
    private investorService;
    private configService;
    constructor(walletRepository: Repository<Wallet>, investorService: InvestorService, configService: ConfigService);
    createAccount(email: string): Promise<{
        investor: import("../investor/entities/investor.entity").Investor;
        ethMnemonic: any;
        ethPublicKey: any;
        ethPrivateKey: any;
        solMnemonic: any;
        solPublicKey: any;
        solPrivateKey: any;
        btcMnemonic: any;
        btcPublicKey: any;
        btcPrivateKey: any;
    } & Wallet>;
    getWalletByEmail(email: string): Promise<any>;
    getCoinBalance(email: string): Promise<{
        name: string;
        symbol: string;
        image: string;
        balance: any;
    }[]>;
    isWalletExists(email: string): Promise<boolean>;
}
