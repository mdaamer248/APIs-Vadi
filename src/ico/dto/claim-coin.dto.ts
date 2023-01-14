import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ClaimCoinDTO{
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    transaction_hash: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    eth_address: string
}