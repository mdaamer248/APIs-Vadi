import { ConfigService } from '@nestjs/config';
import { InvestorService } from 'src/investor/investor.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { VdcService } from 'src/wallet/blockChains/vadiCoin/vadicoin.service';
import { Pay } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { HotPay } from './entities/hotpayment.entity';
import { CreateHotPayDto } from './dto/create-hot-pay.dto';
import { UpdateHotPayDto } from './dto/update-hot-pay.dto';
export declare class PaymentService {
    private paymentRepository;
    private hotPayRepository;
    private investorService;
    private configService;
    private vdcService;
    web3: any;
    constructor(paymentRepository: Repository<Pay>, hotPayRepository: Repository<HotPay>, investorService: InvestorService, configService: ConfigService, vdcService: VdcService);
    createOrder(amount: string, user_email: string): Promise<{
        orderID: any;
    }>;
    capturePayment(orderId: string, email: string): Promise<any>;
    generateAccessToken(): Promise<any>;
    createPayment(createPaymentDto: CreatePaymentDto): Promise<Pay>;
    getPaymentByOrderId(order_id: string): Promise<Pay>;
    getAllPayments(): Promise<Pay[]>;
    updatePayment(updatePaymentDto: UpdatePaymentDto): Promise<Pay>;
    checkTransactionStatus(hash: string): Promise<string>;
    issueTokens(amountPaid: string, order_id: string, email: string): Promise<any>;
    createHotWalletOrder(email: string): Promise<{
        eth_address: any;
    }>;
    claimVadiCoins(email: string, senderAddress: string): Promise<Promise<any>[]>;
    verifyTransaction(vadi_address: string, from: string, user_email: string): Promise<any>;
    handlePendingTransaction(tsxs: any[], email: string): Promise<Promise<any>[]>;
    createHotPay(createHotPayDto: CreateHotPayDto): Promise<HotPay>;
    updateHotPay(updateHotPayDto: UpdateHotPayDto): Promise<HotPay>;
    exchangeToVdcCoins(email: string, amount: string): Promise<any>;
}
