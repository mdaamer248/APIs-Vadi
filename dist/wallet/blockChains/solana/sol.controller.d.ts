import { SendCoinDto } from 'src/wallet/dto/send-coin.dto';
import { SolService } from './sol.service';
export declare class SolController {
    private readonly solService;
    constructor(solService: SolService);
    sendEth(req: any, sendSolDto: SendCoinDto): Promise<any>;
}
