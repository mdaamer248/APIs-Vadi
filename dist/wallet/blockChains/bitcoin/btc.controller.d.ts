import { SendCoinDto } from 'src/wallet/dto/send-coin.dto';
import { BtcService } from './btc.service';
export declare class BtcController {
    private readonly btcService;
    constructor(btcService: BtcService);
    sendEth(req: any, sendBtcDto: SendCoinDto): Promise<any>;
}
