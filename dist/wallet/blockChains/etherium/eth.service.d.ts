import { ConfigService } from '@nestjs/config';
import { SendCoinDto } from 'src/wallet/dto/send-coin.dto';
import { WalletService } from 'src/wallet/wallet.service';
export declare class EthService {
    private walletService;
    private configService;
    constructor(walletService: WalletService, configService: ConfigService);
    sendEth(email: string, sendEthDto: SendCoinDto): Promise<any>;
}
