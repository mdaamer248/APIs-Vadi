import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { CreatePayPalPaymentDto } from './dto/create-paypal-payment.dto';
import { CreateHotWalletICODTO } from './dto/ico-tsx.dto';
import { UpdateHotWalletICODTO } from './dto/update-ico-tsx.dto';
import { UpdatePayPalPaymentDto } from './dto/update-paypal-payment.dto';
import { HotWalletICO } from './entity/hot-wallet.ico.entity';
import { PayPalIcoPayment } from './entity/paypal-ico.entity';
export declare class ICOService {
    private icoTsxsRepository;
    private payPalRepository;
    private configService;
    web3: any;
    account: any;
    contract: any;
    constructor(icoTsxsRepository: Repository<HotWalletICO>, payPalRepository: Repository<PayPalIcoPayment>, configService: ConfigService);
    claimCoins(tsxHash: string, eth_address: string): Promise<any>;
    transferVadiCoins(address: string, amount: number): Promise<any>;
    issueTokens(amountPaid: string, order_id: string): Promise<any>;
    ethToVadiCoin(tsx_hash: string): Promise<any>;
    ethTsxUpdate(tsx_hash: string): Promise<{
        tsx_hash: string;
        tsx_status: string;
    }>;
    createTsx(createIcoTsx: CreateHotWalletICODTO): Promise<HotWalletICO>;
    updateTsx(updateTsxDto: UpdateHotWalletICODTO): Promise<HotWalletICO>;
    findByRecievedTsxHash(hash: string): Promise<HotWalletICO>;
    checkTransactionStatus(hash: string): Promise<string>;
    createOrder(amount: string): Promise<{
        orderID: any;
    }>;
    capturePayment(orderId: string): Promise<any>;
    generateAccessToken(): Promise<any>;
    createPayment(createPaymentDto: CreatePayPalPaymentDto): Promise<PayPalIcoPayment>;
    getPaymentByOrderId(order_id: string): Promise<PayPalIcoPayment>;
    getAllPayments(): Promise<PayPalIcoPayment[]>;
    updatePayment(updatePaymentDto: UpdatePayPalPaymentDto): Promise<PayPalIcoPayment>;
}
