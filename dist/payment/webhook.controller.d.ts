import { SubmitEthAddressDTO } from './dto/submit-eth-address.dto';
import { WebHookService } from './webhook.service';
export declare class WebhookController {
    private webHookService;
    constructor(webHookService: WebHookService);
    handleWebhook(body: any): Promise<string>;
    submitEthAddress(body: SubmitEthAddressDTO): Promise<import("./entities/payment.entity").Pay>;
}
