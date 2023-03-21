import { SubmitICOEthAddressDTO } from './dto/submit-ico-eth-address.dto';
import { ICOWebHookService } from './ico.webhook.service';
export declare class ICOWebhookController {
    private webHookService;
    constructor(webHookService: ICOWebHookService);
    handleWebhook(body: any): Promise<string>;
    submitEthAddress(body: SubmitICOEthAddressDTO): Promise<import("./entity/paypal-ico.entity").PayPalIcoPayment>;
    claimVadiCoinsByOrderId(orderId: string): Promise<any>;
}
