import { ClaimCoinDTO } from './dto/claim-coin.dto';
import { PaymentAmountDto } from './dto/payment-amount.dto';
import { ICOService } from './ico.service';
import { PayPalService } from './paypal.service';
export declare class ICOController {
    private icoService;
    private paypalService;
    constructor(icoService: ICOService, paypalService: PayPalService);
    claimVadiCoins(body: ClaimCoinDTO): Promise<any>;
    claimVadiCoinsByEth(tsx_hash: string): Promise<{
        tsx_hash: string;
        tsx_status: string;
    }>;
    create(amount: PaymentAmountDto): Promise<{
        orderID: any;
    }>;
    captureOrder(orderID: string): Promise<any>;
}
