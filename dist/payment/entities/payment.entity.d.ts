export declare class Pay {
    id: number;
    order_id: string;
    payer_name: string;
    payer_email: string;
    user_email: string;
    gross_amount: string;
    net_amount: string;
    paypal_fee: string;
    currency: string;
    status: string;
    eth_address: string;
    tokens_amount: string;
    tokens_transfered: boolean;
    transaction_hash: string;
    'created_at': Date;
    'updated_at': Date;
}
