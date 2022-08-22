import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, isNotEmpty, IsString } from "class-validator";


export class CreateInvestorDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	password: string;

	@ApiProperty()
	@IsString()
	refferalCode: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	role: string;
}
