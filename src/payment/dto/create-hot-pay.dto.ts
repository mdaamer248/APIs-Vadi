import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateHotPayDto {


  @ApiProperty()
  @IsOptional()
  @IsEmail()
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
}
