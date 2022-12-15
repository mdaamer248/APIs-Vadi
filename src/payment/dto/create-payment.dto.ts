import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  order_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  payer_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  payer_email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  gross_amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  net_amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  tokens_amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  tokens_transfered: boolean;
}
