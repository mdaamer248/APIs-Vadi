import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty} from "class-validator";


export class OTPGeneratorDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	email: string;

}

	
