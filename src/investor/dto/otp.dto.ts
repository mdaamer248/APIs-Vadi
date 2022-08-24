import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsEmail} from "class-validator";


export class OTPDto {

	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	email : string;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	otp: number;


	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	timeStamp: number;
}

	
