import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class PasswordDto {
    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	password: string;
}
