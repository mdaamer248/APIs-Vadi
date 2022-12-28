import { InvestorProfile } from 'src/investor-profile/entities/investor-profile.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique
  } from 'typeorm';

@Entity()
@Unique(['email'])
export class Investor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  userName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({nullable: true})
  refferalCode: string;

  @Column({nullable:true})
  role: string;

  @Column({default: false})
  isConfirmed: boolean;

  @Column({default: false})
  isTokenSubscribed: boolean;

  @Column({nullable: true})
  validationCode : number;

  @Column({nullable: true})
  otpIssuedAt : number;

  @Column({nullable: true})
  resetToken: string;

  @Column({nullable: true})
  resetTokenIssuedAt : number;

  @OneToOne(() => Wallet, (wallet) => wallet.investor )
  wallet : Wallet;

  @OneToOne(() => InvestorProfile, (investorProfile) => investorProfile.investor )
  @JoinColumn()
  investorProfile : InvestorProfile;
}
