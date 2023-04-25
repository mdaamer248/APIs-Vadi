import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsEmail} from "class-validator";


export class MobileDto {

	
	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	dailcode : number;
	
	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	mobile : number;
}