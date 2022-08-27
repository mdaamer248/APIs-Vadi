import { Module } from '@nestjs/common';
import { InvestorProfileService } from './investor-profile.service';
import { InvestorProfileController } from './investor-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { InvestorProfile } from './entities/investor-profile.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Investor } from 'src/investor/entities/investor.entity';



@Module({
  imports: [ 
  TypeOrmModule.forFeature([InvestorProfile]),
  TypeOrmModule.forFeature([Investor]),
  ConfigModule.forRoot({
    envFilePath:'.env',
  }), MulterModule.register({
    dest: './files',
  })],
  controllers: [InvestorProfileController],
  providers: [InvestorProfileService]
})
export class InvestorProfileModule {}
