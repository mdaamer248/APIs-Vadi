import { MailerService } from '@nestjs-modules/mailer';
import { Investor } from '../entities/investor.entity';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendUserConfirmationMail(investor: Investor, validationCode: number): Promise<{
        otpIssuedAt: number;
        code: number;
        message: string;
        verificationcode: number;
    }>;
    sendUserPasswordResetEMail(investor: Investor, email: string): Promise<{
        resetTokenIssuedAt: number;
        code: number;
        message: string;
        email: string;
    }>;
}
