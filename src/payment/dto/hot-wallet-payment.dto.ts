import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class HotWalletPaymentDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    vadi_address: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    metamask_address: string;
}