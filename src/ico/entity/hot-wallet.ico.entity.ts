import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class HotWalletICO {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  recieved_token_tsx_hash: string;

  @Column({ nullable: true })
  recieved_token_amount: number;

  @Column({ nullable: true })
  users_eth_address: string;

  @Column({ nullable: true })
  recieved_token_name: string;

  @Column({ nullable: true })
  tsx_status: string;

  @Column({ nullable: true })
  vadi_coin_amount: number;

  @Column({ nullable: true })
  vadi_coins_transfered: boolean;

  @Column({ nullable: true })
  vadi_coin_transfer_tsx_hash: string;

  @CreateDateColumn({ name: 'created_at' })
  'created_at': Date;

  @UpdateDateColumn({ name: 'updated_at' })
  'updated_at': Date;
}
