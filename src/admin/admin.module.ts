import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Admin } from './entities/admin.entity';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthService } from './admin.auth.service';
import { MailService } from './mail/mail.service';
import { InvestorProfile } from 'src/investor-profile/entities/investor-profile.entity';
import { Investor } from 'src/investor/entities/investor.entity';
import { InvestorService } from 'src/investor/investor.service';
import { InvestorProfileService } from 'src/investor-profile/investor-profile.service';
import { User } from 'src/investor/entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    TypeOrmModule.forFeature([InvestorProfile]),
    TypeOrmModule.forFeature([Investor]),
    TypeOrmModule.forFeature([User]),


    ConfigModule.forRoot({
      envFilePath:'.env',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions:{
        expiresIn: '24h'
      }
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          secure: false,
          auth: {
            user:process.env.MAIL_USERNAME,
            pass:process.env.MAIL_PASSWORD
          },
        },
        template: {
          dir: join(__dirname, '/templates'),
          adapter: new HandlebarsAdapter,
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, AuthService, MailService, InvestorService,InvestorProfileService]
})
export class AdminModule {}
