import { ClaimCoinDTO } from "./dto/claim-coin.dto";
import { PaymentAmountDto } from "./dto/payment-amount.dto";
import { ICOService } from "./ico.service";
export declare class ICOController {
    private icoService;
    constructor(icoService: ICOService);
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
