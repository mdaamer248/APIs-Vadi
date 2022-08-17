import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNumber} from "class-validator";

export class UpdateAdminDto  {
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
  @IsString()
  @IsOptional()
  newResetToken?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  newResetTokenIssuedAt?: number;

}
