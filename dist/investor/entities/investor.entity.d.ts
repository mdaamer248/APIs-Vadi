import { InvestorProfile } from 'src/investor-profile/entities/investor-profile.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
export declare class Investor {
    id: number;
    userName: string;
    email: string;
    password: string;
    refferalCode: string;
    role: string;
    isConfirmed: boolean;
    isTokenSubscribed: boolean;
    validationCode: number;
    otpIssuedAt: number;
    resetToken: string;
    resetTokenIssuedAt: number;
    wallet: Wallet;
    investorProfile: InvestorProfile;
}
