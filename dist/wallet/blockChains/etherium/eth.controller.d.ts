import { EthService } from './eth.service';
import { SendCoinDto } from 'src/wallet/dto/send-coin.dto';
export declare class EthController {
    private readonly ethService;
    constructor(ethService: EthService);
    sendEth(req: any, sendEthDto: SendCoinDto): Promise<any>;
}
