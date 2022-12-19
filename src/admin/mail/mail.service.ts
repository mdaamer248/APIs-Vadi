import { Injectable } from '@nestjs/common';
import { AdminService } from '../admin.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private adminService: AdminService,
    private mailerService: MailerService,
  ) {}

  //Sending password reset link with mail
  async sendUserPasswordResetEMail(email: string) {
    //const url = `http://localhost:4000/api/admin/reset-password?token=${resetToken}`;
    const url = `http://134.209.96.231/?email=${email}`;

    const [admin] = await this.adminService.find(email);

    const sendMail = await this.mailerService.sendMail({
      to: email,
      subject: 'Use the following link to reset your password.',
      html: `<p>Hey ${admin.userName},</p>
            <p>Please click below to reset your password</p>
            <p>
              <button><a href=${url}>Reset</a></button>
            </p>
            <p>
              Or copy
              ${url}
              and paste it
            </p>
            <p>If you did not request this email, you can safely ignore it.</p>`,
      context: {
        name: `${admin.userName}`,
      },
    });

    if (sendMail) {
      //const newResetToken = resetToken;
      const newResetTokenIssuedAt = Math.floor(Date.now() / 1000);
      await this.adminService.update(admin.id, {
        newResetTokenIssuedAt,
      });
      return {
        code: 200,
        message: 'mail sent',
      };
    }
  }
}
