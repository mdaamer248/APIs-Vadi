import { Investor } from 'src/investor/entities/investor.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  ethPublicKey: string;

  @Column({ nullable: true })
  ethPrivateKey: string;

  @Column({ nullable: true })
  ethMnemonic: string;

  @Column({ nullable: true })
  solPublicKey: string;

  @Column({ nullable: true })
  solPrivateKey: string;

  @Column({ nullable: true })
  solMnemonic: string;

  @Column({ nullable: true })
  btcPublicKey: string;

  @Column({ nullable: true })
  btcPrivateKey: string;

  @Column({ nullable: true })
  btcMnemonic: string;

  // @Column('text', { nullable: true, array: true })
  // tsxs: string[];

  @OneToOne(() => Investor, (investor) => investor.wallet)
  @JoinColumn()
  investor: Investor;
}
