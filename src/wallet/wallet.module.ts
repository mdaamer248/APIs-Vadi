import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { BnbController } from './blockChains/Binance/bnb.controller';
import { BtcController } from './blockChains/bitcoin/btc.controller';
import { EthController } from './blockChains/etherium/eth.controller';
import { MtcController } from './blockChains/polygon/mtc.controller';
import { SolController } from './blockChains/solana/sol.controller';
import { VdcController } from './blockChains/vadiCoin/vadicoin.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BnbService } from './blockChains/Binance/bnb.service';
import { BtcService } from './blockChains/bitcoin/btc.service';
import { EthService } from './blockChains/etherium/eth.service';
import { MtcService } from './blockChains/polygon/mtc.service';
import { SolService } from './blockChains/solana/sol.service';
import { VdcService } from './blockChains/vadiCoin/vadicoin.service';
import { InvestorModule } from 'src/investor/investor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), InvestorModule],
  controllers: [
    WalletController,
    VdcController,
    EthController,
    BnbController,
    MtcController,
    SolController,
    BtcController,
  ],
  providers: [
    WalletService,
    ConfigService,
    EthService,
    SolService,
    BtcService,
    BnbService,
    MtcService,
    VdcService,
  ],
})
export class WalletModule {}
