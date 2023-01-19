import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ClaimCoinDTO } from "./dto/claim-coin.dto";
import { PaymentAmountDto } from "./dto/payment-amount.dto";
import { ICOService } from "./ico.service";

@ApiTags('ICO')
@Controller('ico')
export class ICOController{
    constructor(private icoService: ICOService){}

    // For Stable Coins
    @Post('/claim/vadi-coins')
    async claimVadiCoins(@Body() body: ClaimCoinDTO){
        const tsx_hash = await this.icoService.claimCoins(body.transaction_hash, body.eth_address);
        return tsx_hash;
    }

    // For Paypal Payments
    @Post('/create/order')
    async create(@Body() amount: PaymentAmountDto) {
    const orderId = await this.icoService.createOrder(amount.amount);
      return orderId;
    }
  
    @Post('capture/:orderID')
    async captureOrder(@Param('orderID') orderID: string) {
      const tsx = await this.icoService.capturePayment(orderID);
      return tsx;
    }
}