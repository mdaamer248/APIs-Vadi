import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class EthToVadiDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    eth_amount: string;
}