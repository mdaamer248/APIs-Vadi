import { ICOService } from './ico.service';
export declare class ICOWebHookService {
    private icoService;
    constructor(icoService: ICOService);
    checkoutOrderApproved(body: any): Promise<string>;
    paymentCaptureCompleted(body: any): Promise<string>;
    submitEthAddress(order_id: string, eth_address: string): Promise<import("./entity/paypal-ico.entity").PayPalIcoPayment>;
    issueVadiCoins(orderId: string): Promise<any>;
}
