import { PaymentService } from './payment.service';
export declare class WebHookService {
    private paymentService;
    constructor(paymentService: PaymentService);
    verifySignature(transmissionId: string, body: any, signature: string): boolean;
    checkoutOrderApproved(body: any): Promise<string>;
    paymentCaptureCompleted(body: any): Promise<string>;
    submitEthAddress(order_id: string, eth_address: string): Promise<import("./entities/payment.entity").Pay>;
}
