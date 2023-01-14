import { Module } from '@nestjs/common';
import { WalletModule } from 'src/wallet/wallet.module';
import { ICOController } from './ico.controller';
import { ICOService } from './ico.service';

@Module({
  controllers: [ICOController],
  providers: [ICOService],
})
export class ICOModule {}
