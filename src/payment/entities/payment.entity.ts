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
  tokens_amount: string;

  @Column({nullable: true})
  tokens_transfered: boolean;
}
