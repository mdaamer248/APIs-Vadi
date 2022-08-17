import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString} from "class-validator";


export class GetFileDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	email: string;

    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	type: string;

}