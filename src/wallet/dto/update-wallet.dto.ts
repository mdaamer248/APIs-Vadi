import { PartialType } from '@nestjs/swagger';
import { CreateWalletDto } from './create-wallet.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {

  @ApiProperty()
  @IsOptional()
  @IsString()
  ethPublicKey: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  ethPrivateKey: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  ethMnemonic: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  solPublicKey: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  solPrivateKey: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  solMnemonic: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  btcPublicKey: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  btcPrivateKey: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  btcMnemonic: string;

}
