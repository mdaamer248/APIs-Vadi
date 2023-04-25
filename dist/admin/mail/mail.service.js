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
const admin_service_1 = require("../admin.service");
const mailer_1 = require("@nestjs-modules/mailer");
let MailService = class MailService {
    constructor(adminService, mailerService) {
        this.adminService = adminService;
        this.mailerService = mailerService;
    }
    async sendUserPasswordResetEMail(email) {
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
};
MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        mailer_1.MailerService])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map