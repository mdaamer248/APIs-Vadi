import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ClaimCoinDTO } from "./dto/claim-coin.dto";
import { ICOService } from "./ico.service";

@ApiTags('ICO')
@Controller('ICO')
export class ICOController{
    constructor(private icoService: ICOService){}

    @Post('/claim/vadi-coins')
    async claimVadiCoins(@Body() body: ClaimCoinDTO){
        const tsx_hash = await this.icoService.claimCoins(body.transaction_hash, body.eth_address);
        return tsx_hash;
    }
}