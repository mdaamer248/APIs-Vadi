import { IsNotEmpty, IsString } from "class-validator";

export class MakePaymentDto{
    @IsNotEmpty()
    @IsString()
    amount: string;
}