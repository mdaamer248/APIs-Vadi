import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreatePaymentDto } from './create-payment.dto';

export class UpdateHotPayDto extends PartialType(CreatePaymentDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  user_email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  amount?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  vadi_address?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  from?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  recieved_tsx_hash?: string;

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

  @ApiProperty()
  @IsOptional()
  @IsString()
  transaction_hash?: string;
}
