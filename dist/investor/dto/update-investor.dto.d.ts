import { Wallet } from 'src/wallet/entities/wallet.entity';
export declare class UpdateInvestorDto {
    userName?: string;
    password?: string;
    email?: string;
    validationCode?: number;
    otpIssuedAt?: number;
    resetToken?: string;
    resetTokenIssuedAt?: number;
    isConfirmed?: boolean;
    isTokenSubscribed?: boolean;
    wallet?: Wallet;
}
