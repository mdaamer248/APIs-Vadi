import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class PayPalIcoPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: string;

  @Column({nullable: true})
  payer_name: string;

  @Column({nullable: true})
  payer_email: string;

  @Column({nullable: true})
  gross_amount: string;

  @Column({nullable: true})
  net_amount: string;

  @Column({nullable: true})
  paypal_fee: string;

  @Column({nullable: true})
  currency: string;

  @Column({nullable: true})
  status: string;

  @Column({nullable: true})
  eth_address: string;

  @Column({nullable: true})
  vadi_coin_amount: string;

  @Column({nullable: true})
  void_coin_transfered: boolean;

  @Column({nullable: true})
  vadi_coin_transfer_tsx_hash: string;

  @CreateDateColumn({ name: 'created_at' }) 
  'created_at': Date;
  
  @UpdateDateColumn({ name: 'updated_at' }) 
  'updated_at': Date;
}
