import { SendCoinDto } from 'src/wallet/dto/send-coin.dto';
import { WalletService } from 'src/wallet/wallet.service';
export declare class SolService {
    private walletService;
    constructor(walletService: WalletService);
    sendSol(email: string, sendSolDto: SendCoinDto): Promise<any>;
}
