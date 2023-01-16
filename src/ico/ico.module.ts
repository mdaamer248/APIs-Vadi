import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotWalletICO } from './entity/hot-wallet.ico.entity';
import { ICOController } from './ico.controller';
import { ICOService } from './ico.service';

@Module({
  imports: [TypeOrmModule.forFeature([HotWalletICO]),],
  controllers: [ICOController],
  providers: [ICOService],
})
export class ICOModule {}
