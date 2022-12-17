import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: string;

  @Column({nullable: true})
  payer_name: string;

  @Column({nullable: true})
  payer_email: string;

  @Column({nullable: true})
  user_email: string;

  @Column({nullable: true})
  gross_amount: number;

  @Column({nullable: true})
  net_amount: number;

  @Column({nullable: true})
  paypal_fee: number;

  @Column({nullable: true})
  currency: string;

  @Column({nullable: true})
  status: boolean;

  @Column({nullable: true})
  tokens_amount: number;

  @Column({nullable: true})
  tokens_transfered: boolean;
}
