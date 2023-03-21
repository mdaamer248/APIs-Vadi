import { SendCoinDto } from 'src/wallet/dto/send-coin.dto';
import { MtcService } from './mtc.service';
export declare class MtcController {
    private readonly mtcService;
    constructor(mtcService: MtcService);
    sendEth(req: any, sendEthDto: SendCoinDto): Promise<any>;
}
