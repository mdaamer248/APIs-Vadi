import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: string;

  @Column()
  payer_name: string;

  @Column()
  payer_email: string;

  @Column()
  gross_amount: number;

  @Column()
  net_amount: number;

  @Column()
  status: boolean;

  @Column()
  tokens_amount: number;

  @Column()
  tokens_transfered: boolean;
}
