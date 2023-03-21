import { ConfigService } from '@nestjs/config';
import { SendCoinDto } from 'src/wallet/dto/send-coin.dto';
import { WalletService } from 'src/wallet/wallet.service';
export declare class VdcService {
    private configService;
    private walletService;
    constructor(configService: ConfigService, walletService: WalletService);
    sendVadiCoin(email: string, sendVdcDto: SendCoinDto): Promise<any>;
    purchaseVadiCoin(email: string, amount: number): Promise<any>;
}
