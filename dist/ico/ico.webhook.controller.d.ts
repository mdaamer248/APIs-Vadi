import { SubmitICOEthAddressDTO } from './dto/submit-ico-eth-address.dto';
import { ICOWebHookService } from './ico.webhook.service';
export declare class ICOWebhookController {
    private webHookService;
    constructor(webHookService: ICOWebHookService);
    handleWebhook(body: any): Promise<"Payment has been updated" | "Payment is already been confirmed." | "Payment already has net amount with it.">;
    submitEthAddress(body: SubmitICOEthAddressDTO): Promise<import("./entity/paypal-ico.entity").PayPalIcoPayment>;
    claimVadiCoinsByOrderId(orderId: string): Promise<any>;
    getOrderDetailsByOrderId(orderId: string): Promise<any>;
}
