import { AdminService } from '../admin.service';
import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private adminService;
    private mailerService;
    constructor(adminService: AdminService, mailerService: MailerService);
    sendUserPasswordResetEMail(email: string): Promise<{
        code: number;
        message: string;
    }>;
}
