import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, isNotEmpty, IsString, IsDate, IsNumber, IsOptional} from "class-validator";


export class UploadInvestorProfileDocumentDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	email: string;


    @ApiProperty()
	@IsString()
	idFront: string;


    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	idBackSide: string;


    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	idNumber: string;


    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	addressDoc: string;
}