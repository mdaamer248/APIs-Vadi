import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, isNotEmpty, IsString, IsDate, IsNumber, IsOptional, IsEmpty} from "class-validator";


export class CreateInvestorProfileDto {

	// @ApiProperty()
	// @IsEmpty()
	// userId: number;

	@ApiProperty()
	@IsNotEmpty()
	range: string;

	@ApiProperty()
	@IsNotEmpty()
	lower: string;

	@ApiProperty()
	@IsNotEmpty()
	upper: string;

	// @IsNotEmpty()
	// @ApiProperty()
	// @IsNotEmpty()
	// email: string;

	@ApiProperty()
	@IsNotEmpty()
	fundAmount: number;

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
	fullName: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	dateOfBirth: Date;

    @ApiProperty()
	@IsNotEmpty()
	@IsString()
	countryOfBirth: string;

    @ApiProperty()
	@IsNotEmpty()
	countryCode: number;


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
	@IsNumber()
	tax: number;

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

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	documentNo: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	isGeo: string;

	@ApiProperty()
	@IsNotEmpty()
	isEmailVerified: boolean;

	@ApiProperty()
	@IsNotEmpty()
	isProfileCompleted: boolean;




}
