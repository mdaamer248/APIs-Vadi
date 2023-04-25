import { PaymentService } from './payment.service';
import { MakePaymentDto } from './dto/make-payment.dto';
import { HotWalletPaymentDto } from './dto/hot-wallet-payment.dto';
import { EthToVadiDto } from './dto/eth-to-vadi.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    create(req: any, payment: MakePaymentDto): Promise<{
        orderID: any;
    }>;
    captureOrder(req: any, orderID: string): Promise<any>;
    getAllpayments(): Promise<import("./entities/payment.entity").Pay[]>;
    createHotWalletPayment(req: any): Promise<{
        eth_address: any;
    }>;
    claimVadiCoins(req: any, hotWalletPaymentDto: HotWalletPaymentDto): Promise<Promise<any>[]>;
    exchangeToVadiCoins(req: any, ethToVadiDto: EthToVadiDto): Promise<any>;
}
