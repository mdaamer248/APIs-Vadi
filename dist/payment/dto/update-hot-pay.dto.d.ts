import { CreatePaymentDto } from './create-payment.dto';
declare const UpdateHotPayDto_base: import("@nestjs/common").Type<Partial<CreatePaymentDto>>;
export declare class UpdateHotPayDto extends UpdateHotPayDto_base {
    user_email?: string;
    amount?: string;
    vadi_address?: string;
    from?: string;
    recieved_tsx_hash?: string;
    status?: string;
    tokens_amount?: string;
    tokens_transfered?: boolean;
    transaction_hash?: string;
}
export {};
