import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePaymentDto {
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
  @IsEmail()
  payer_email?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  user_email?: string;

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
  tokens_amount?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  tokens_transfered?: boolean;
}
