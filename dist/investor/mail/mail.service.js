"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
let MailService = class MailService {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendUserConfirmationMail(investor, validationCode) {
        const sendMail = await this.mailerService.sendMail({
            to: investor.email,
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
                name: `${investor.email}`,
            },
        });
        if (sendMail) {
            const otpIssuedAt = Math.floor(Date.now() / 1000);
            return {
                otpIssuedAt,
                code: 200,
                message: 'mail sent',
                verificationcode: validationCode,
            };
        }
    }
    async sendUserPasswordResetEMail(investor, email) {
        const url = `http://134.209.96.231/?email=${email}`;
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
            const resetTokenIssuedAt = Math.floor(Date.now() / 1000);
            return {
                resetTokenIssuedAt,
                code: 200,
                message: 'Mail sent successfully',
                email: email
            };
        }
    }
};
MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map