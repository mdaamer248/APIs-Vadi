import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class HotPay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_email: string;

  @Column({ nullable: true })
  amount: string;

  @Column({ nullable: true })
  vadi_address: string;

  @Column({ nullable: true })
  from: string;

  @Column({ nullable: true })
  recieved_tsx_hash: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  tokens_amount: string;

  @Column({ nullable: true })
  tokens_transfered: boolean;

  @Column({ nullable: true })
  transaction_hash: string;

  @CreateDateColumn({ name: 'created_at' })
  'created_at': Date;

  @UpdateDateColumn({ name: 'updated_at' })
  'updated_at': Date;
}
