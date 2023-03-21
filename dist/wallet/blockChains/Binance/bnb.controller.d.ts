import { SendCoinDto } from 'src/wallet/dto/send-coin.dto';
import { BnbService } from './bnb.service';
export declare class BnbController {
    private readonly bnbService;
    constructor(bnbService: BnbService);
    sendEth(req: any, sendEthDto: SendCoinDto): Promise<any>;
}
