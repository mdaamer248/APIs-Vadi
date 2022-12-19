import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { InvestorModule } from 'src/investor/investor.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { WebHookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { Pay } from './entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Pay]), InvestorModule, WalletModule],
  controllers: [PaymentController, WebhookController],
  providers: [PaymentService, WebHookService],
})
export class PaymentModule {}
