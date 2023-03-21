export declare class CreatePaymentDto {
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
    tokens_transfered?: boolean;
}
