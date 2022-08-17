import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, isNotEmpty, IsString, IsDate, IsNumber, IsOptional, IsEmpty} from "class-validator";


export class CreateInvestorProfileDto {
	@ApiProperty()
	@IsEmpty()
	email: string;


    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	firstName: string;


    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	lastName: string;


	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	dateOfBirth: string;

    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	countryOfBirth: string;


    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	nationality: string;


    @ApiProperty()
	@IsOptional()
	@IsNumber()
	cURP: number;


    @ApiProperty()
	@IsOptional()
	@IsNumber()
	rFC: number;

    @ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	phoneNumber: number;


    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	occupation: string;


    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	homeAddress: string;


    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	street: string;


    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	exterior: string;

    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	interior: string;

    @ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	postalCode: number;

    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	colony: string;

    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	muncipiality: string;

    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	state: string;

}
