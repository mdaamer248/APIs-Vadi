import { Module } from '@nestjs/common';
import { InvestorProfileService } from './investor-profile.service';
import { InvestorProfileController } from './investor-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { InvestorProfile } from './entities/investor-profile.entity';
import { MulterModule } from '@nestjs/platform-express';
import { InvestorModule } from 'src/investor/investor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvestorProfile]),
    MulterModule.register({
      dest: './files',
    }),
    InvestorModule,
  ],
  controllers: [InvestorProfileController],
  providers: [InvestorProfileService],
  exports: [InvestorProfileService],
})
export class InvestorProfileModule {}
