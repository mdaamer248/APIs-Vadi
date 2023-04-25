import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Wallet } from 'src/wallet/entities/wallet.entity';

export class UpdateInvestorDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  validationCode?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  otpIssuedAt?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  resetToken?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  resetTokenIssuedAt?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isConfirmed?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isTokenSubscribed?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  wallet?: Wallet;
}
