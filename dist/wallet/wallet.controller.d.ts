import { WalletService } from './wallet.service';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    createEthAccount(req: any): Promise<{
        investor: import("../investor/entities/investor.entity").Investor;
        ethMnemonic: any;
        ethPublicKey: any;
        ethPrivateKey: any;
        solMnemonic: any;
        solPublicKey: any;
        solPrivateKey: any;
        btcMnemonic: any;
        btcPublicKey: any;
        btcPrivateKey: any;
    } & import("./entities/wallet.entity").Wallet>;
    getEthBalance(req: any): Promise<{
        name: string;
        symbol: string;
        image: string;
        balance: any;
    }[]>;
    checkExistance(req: any): Promise<boolean>;
    getWalletByEmail(req: any): Promise<any>;
}
