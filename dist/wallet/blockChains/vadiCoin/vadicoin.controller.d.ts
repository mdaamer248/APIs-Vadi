import { SendCoinDto } from 'src/wallet/dto/send-coin.dto';
import { VdcService } from './vadicoin.service';
export declare class VdcController {
    private readonly vdcService;
    constructor(vdcService: VdcService);
    sendEth(req: any, sendVdcDto: SendCoinDto): Promise<any>;
    purchaseEth(req: any, amount: number): Promise<any>;
}
