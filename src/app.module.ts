import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvestorModule } from './investor/investor.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { InvestorProfileModule } from './investor-profile/investor-profile.module';
import { AdminModule } from './admin/admin.module';
import { WalletModule } from './wallet/wallet.module';
import { JwtModule } from '@nestjs/jwt';
import { PaymentModule } from './payment/payment.module';
import { ICOModule } from './ico/ico.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [
    InvestorModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    InvestorProfileModule,
    AdminModule,
    WalletModule,
    PaymentModule,
    ICOModule,
    ResourcesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
