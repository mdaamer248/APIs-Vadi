import { ICOService } from './ico.service';
import { PayPalService } from './paypal.service';
export declare class ICOWebHookService {
    private icoService;
    private paypalService;
    constructor(icoService: ICOService, paypalService: PayPalService);
    checkoutOrderApproved(body: any): Promise<"Payment has been updated" | "Payment is already been confirmed.">;
    paymentCaptureCompleted(body: any): Promise<"Payment has been updated" | "Payment already has net amount with it.">;
    submitEthAddress(order_id: string, eth_address: string): Promise<import("./entity/paypal-ico.entity").PayPalIcoPayment>;
    issueVadiCoins(orderId: string): Promise<any>;
    getOrderDetailsById(orderId: string): Promise<any>;
}
