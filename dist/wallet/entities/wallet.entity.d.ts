import { Investor } from 'src/investor/entities/investor.entity';
export declare class Wallet {
    id: number;
    ethPublicKey: string;
    ethPrivateKey: string;
    ethMnemonic: string;
    solPublicKey: string;
    solPrivateKey: string;
    solMnemonic: string;
    btcPublicKey: string;
    btcPrivateKey: string;
    btcMnemonic: string;
    investor: Investor;
}
