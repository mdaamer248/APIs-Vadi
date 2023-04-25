import { ConfigService } from '@nestjs/config';
import { ICOService } from './ico.service';
export declare class PayPalService {
    private configService;
    private icoService;
    constructor(configService: ConfigService, icoService: ICOService);
    createOrder(amount: string): Promise<{
        orderID: any;
    }>;
    capturePayment(orderId: string): Promise<any>;
    getOrderDetailsById(orderId: string): Promise<any>;
    generateAccessToken(): Promise<any>;
}
