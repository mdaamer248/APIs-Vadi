import { Module } from '@nestjs/common';
import { InvestorService } from './investor.service';
import { InvestorController } from './investor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investor } from './entities/investor.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail/mail.service';
import { InvestorProfile } from 'src/investor-profile/entities/investor-profile.entity';
import { User } from './entities/user.entity';
import { InvestorProfileModule } from 'src/investor-profile/investor-profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investor]),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: `HI There!`,
      signOptions: {
        expiresIn: '24h',
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          secure: false,
          auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
          },
        },
        template: {
          dir: join(__dirname, '/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    // InvestorProfileModule,
  ],
  controllers: [InvestorController],
  providers: [InvestorService, AuthService, MailService],
  exports: [InvestorService],
})
export class InvestorModule {}
