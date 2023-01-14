import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitEthAddressDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  ethAddress: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  payPalOrderId: string;
}
