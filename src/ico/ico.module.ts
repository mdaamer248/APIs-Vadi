import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotWalletICO } from './entity/hot-wallet.ico.entity';
import { PayPalIcoPayment } from './entity/paypal-ico.entity';
import { ICOController } from './ico.controller';
import { ICOService } from './ico.service';
import { ICOWebhookController } from './ico.webhook.controller';
import { ICOWebHookService } from './ico.webhook.service';
import { PayPalService } from './paypal.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HotWalletICO]),
    TypeOrmModule.forFeature([PayPalIcoPayment]),
  ],
  controllers: [ICOController, ICOWebhookController],
  providers: [ICOService, ICOWebHookService, PayPalService],
})
export class ICOModule {}
