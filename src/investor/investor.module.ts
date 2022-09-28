import { Module } from '@nestjs/common';
import { InvestorService } from './investor.service';
import { InvestorController } from './investor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investor } from './entities/investor.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail/mail.service';
import { InvestorProfile } from 'src/investor-profile/entities/investor-profile.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investor]),
    TypeOrmModule.forFeature([InvestorProfile]),
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
  controllers: [InvestorController],
  providers: [InvestorService, AuthService, MailService]
})
export class InvestorModule {}
