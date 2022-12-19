import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsEmail} from "class-validator";


export class SmsOtpDto {

	@ApiProperty()
	@IsNotEmpty()
    @IsNumber()
	mobile : number;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	otp: number;

}

	
