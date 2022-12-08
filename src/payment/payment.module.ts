import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { InvestorModule } from 'src/investor/investor.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [InvestorModule, WalletModule],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
