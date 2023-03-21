export declare class UpdatePayPalPaymentDto {
    order_id: string;
    payer_name?: string;
    eth_address?: string;
    payer_email?: string;
    gross_amount?: string;
    net_amount?: string;
    paypal_fee?: string;
    currency?: string;
    status?: string;
    vadi_coin_amount?: string;
    vadi_coin_transfered?: boolean;
    vadi_coin_transfer_tsx_hash?: string;
}
