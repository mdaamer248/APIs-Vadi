"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const admin_entity_1 = require("./entities/admin.entity");
const jwt_1 = require("@nestjs/jwt");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const path_1 = require("path");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const admin_auth_service_1 = require("./admin.auth.service");
const mail_service_1 = require("./mail/mail.service");
const investor_profile_entity_1 = require("../investor-profile/entities/investor-profile.entity");
const investor_entity_1 = require("../investor/entities/investor.entity");
const investor_service_1 = require("../investor/investor.service");
const investor_profile_service_1 = require("../investor-profile/investor-profile.service");
const user_entity_1 = require("../investor/entities/user.entity");
let AdminModule = class AdminModule {
};
AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([admin_entity_1.Admin]),
            typeorm_1.TypeOrmModule.forFeature([investor_profile_entity_1.InvestorProfile]),
            typeorm_1.TypeOrmModule.forFeature([investor_entity_1.Investor]),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
            }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: {
                    expiresIn: '24h'
                }
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
                            pass: process.env.MAIL_PASSWORD
                        },
                    },
                    template: {
                        dir: (0, path_1.join)(__dirname, '/templates'),
                        adapter: new handlebars_adapter_1.HandlebarsAdapter,
                        options: {
                            strict: true,
                        },
                    },
                }),
            }),
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService, admin_auth_service_1.AuthService, mail_service_1.MailService, investor_service_1.InvestorService, investor_profile_service_1.InvestorProfileService]
    })
], AdminModule);
exports.AdminModule = AdminModule;
//# sourceMappingURL=admin.module.js.map