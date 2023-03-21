import { CreatePaymentDto } from './create-payment.dto';
declare const UpdatePaymentDto_base: import("@nestjs/common").Type<Partial<CreatePaymentDto>>;
export declare class UpdatePaymentDto extends UpdatePaymentDto_base {
    order_id: string;
    payer_name?: string;
    payer_email?: string;
    user_email?: string;
    gross_amount?: string;
    net_amount?: string;
    paypal_fee?: string;
    currency?: string;
    status?: string;
    tokens_amount?: string;
    eth_address?: string;
    tokens_transfered?: boolean;
    transaction_hash?: string;
}
export {};
