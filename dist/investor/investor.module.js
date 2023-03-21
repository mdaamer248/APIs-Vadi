"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestorModule = void 0;
const common_1 = require("@nestjs/common");
const investor_service_1 = require("./investor.service");
const investor_controller_1 = require("./investor.controller");
const typeorm_1 = require("@nestjs/typeorm");
const investor_entity_1 = require("./entities/investor.entity");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("./auth.service");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const path_1 = require("path");
const mail_service_1 = require("./mail/mail.service");
const user_entity_1 = require("./entities/user.entity");
let InvestorModule = class InvestorModule {
};
InvestorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([investor_entity_1.Investor]),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            jwt_1.JwtModule.register({
                secret: `HI There!`,
                signOptions: {
                    expiresIn: '24h',
                },
            }),
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    transport: {
                        host: 'smtp.gmail.com',
                        secure: false,
                        auth: {
                            user: process.env.MAIL_USERNAME,
                            pass: process.env.MAIL_PASSWORD,
                        },
                    },
                    template: {
                        dir: (0, path_1.join)(__dirname, '/templates'),
                        adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                }),
            }),
        ],
        controllers: [investor_controller_1.InvestorController],
        providers: [investor_service_1.InvestorService, auth_service_1.AuthService, mail_service_1.MailService],
        exports: [investor_service_1.InvestorService],
    })
], InvestorModule);
exports.InvestorModule = InvestorModule;
//# sourceMappingURL=investor.module.js.map