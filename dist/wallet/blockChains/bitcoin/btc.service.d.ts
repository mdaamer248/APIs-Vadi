import { SendCoinDto } from 'src/wallet/dto/send-coin.dto';
import { WalletService } from 'src/wallet/wallet.service';
export declare class BtcService {
    private walletService;
    constructor(walletService: WalletService);
    sendBtc(email: string, sendBtcDto: SendCoinDto): Promise<any>;
}
