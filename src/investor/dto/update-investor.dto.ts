import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNumber, IsBoolean} from "class-validator";

export class UpdateInvestorDto  {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  newUserName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  newPassword?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  newEmail?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  newValidationCode?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  newOtpIssuedAt?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  newResetToken?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  newResetTokenIssuedAt?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  newIsConfirmed?: boolean;
}
