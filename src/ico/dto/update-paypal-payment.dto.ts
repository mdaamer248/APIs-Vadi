import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePayPalPaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  order_id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  payer_name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  eth_address?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  payer_email?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  gross_amount?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  net_amount?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  paypal_fee?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  vadi_coin_amount?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  vadi_coin_transfered?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  vadi_coin_transfer_tsx_hash?: string;
}
