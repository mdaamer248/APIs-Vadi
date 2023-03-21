import { CreateWalletDto } from './create-wallet.dto';
declare const UpdateWalletDto_base: import("@nestjs/common").Type<Partial<CreateWalletDto>>;
export declare class UpdateWalletDto extends UpdateWalletDto_base {
    ethPublicKey: string;
    ethPrivateKey: string;
    ethMnemonic: string;
    solPublicKey: string;
    solPrivateKey: string;
    solMnemonic: string;
    btcPublicKey: string;
    btcPrivateKey: string;
    btcMnemonic: string;
}
export {};
