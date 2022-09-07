import { Injectable } from '@nestjs/common';
import { InvestorService } from '../investor.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private investorService: InvestorService,
    private mailerService: MailerService,
  ) {}

  async sendUserConfirmationMail(email: string, validationCode: number) {
    const [investor] = await this.investorService.find(email);
    const sendMail = await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Vadi,Here is your code',
      text: 'welcome',
      html: `<b style="font-weight:200;font-size:18px;">Hello,Thanks for signup!</b>
             <p style="font-size:13px;line-height:0.8;">You are about to part of great community,
             there are only few steps left.
             Please confirm yor registration in the app with this validation code</p> ${validationCode} <p 
             style="font-size:13px;line-height: 0.8;">In case you have not started any registration process,
             Inore this email</p><p style="font-size:13px;line-height: 0.6;padding-top: 60px;">Thanks,</p>
             <p style="font-size:13px;line-height: 0.3;">Team Vadi</p>`,
      context: {
        name: `${email}`,
      },
    });
    if (sendMail) {
      const newValidationCode = validationCode;
      const newOtpIssuedAt = Math.floor(Date.now() / 1000);
      await this.investorService.update(investor.id, {
        newValidationCode,
        newOtpIssuedAt,
      });
      return {
        code: 200,
        message: 'mail sent',
        verificationcode: validationCode,
      };
    }
  }

  //Sending password reset link with mail
  async sendUserPasswordResetEMail(email: string) {
    //const url = `http://localhost:4000/api/investor/reset-password?token=${resetToken}`;
    const url = `http://134.209.96.231/?email=${email}`;

    const [investor] = await this.investorService.find(email);

    const sendMail = await this.mailerService.sendMail({
      to: email,
      subject: 'Use the following link to reset your password.',
      html: `<p>Hey ${investor.userName},</p>
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
        name: `${investor.userName}`,
      },
    });

    if (sendMail) {
      //const newResetToken = resetToken;
      const newResetTokenIssuedAt = Math.floor(Date.now() / 1000);
      //await this.investorService.update(investor.id, {newResetToken, newResetTokenIssuedAt})
      await this.investorService.update(investor.id, {newResetTokenIssuedAt})

      return {
        code: 200,
        message: 'Mail sent successfully',
        email:email
      };
    }
  }
}
