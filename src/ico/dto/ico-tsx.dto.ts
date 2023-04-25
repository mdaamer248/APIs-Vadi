import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateHotWalletICODTO {
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  recieved_token_tsx_hash?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  recieved_token_amount: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  users_eth_address?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  recieved_token_name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  tsx_status: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  vadi_coin_amount: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  vadi_coins_transfered: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  vadi_coin_transfer_tsx_hash: string;
}
