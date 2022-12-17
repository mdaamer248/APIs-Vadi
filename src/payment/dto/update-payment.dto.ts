import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreatePaymentDto } from './create-payment.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  payer_name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  payer_email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
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
  @IsBoolean()
  status?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  tokens_amount?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  tokens_transfered?: boolean;
}
