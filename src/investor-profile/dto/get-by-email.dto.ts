import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty} from "class-validator";


export class GetByEmailDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	email: string;

}