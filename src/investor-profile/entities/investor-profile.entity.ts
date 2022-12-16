import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique
} from 'typeorm';
import { InvestorLevel } from './investor-level.enum';

@Entity()
// @Unique(['email'])
export class InvestorProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  // @Column({ type: "enum", enum: InvestorLevel, default: InvestorLevel.LevelOne})
  // investorLevel: InvestorLevel;

  @Column()
  range: string;

  @Column()
  lower: number;

  @Column()
  upper: number;

  @Column({nullable: true})
  fundAmount: number;

  @Column({nullable: true})
  totalAmountFunded : number;
  
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({nullable: true})
  fullName: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  countryOfBirth: string;

  @Column()
  countryCode: number;

  @Column({nullable: true})
  cURP: string;

  @Column({ nullable: true})
  rFC: string;

  @Column({type: "bigint"})
  phoneNumber: number;

  @Column({nullable: true})
  tax: string;

  @Column()
  occupation: string;

  @Column()
  nationality: string;

  @Column()
  street: string;

  @Column()
  exterior: string;

  @Column()
  interior: string;

  @Column()
  postalCode: number;

  @Column()
  colony: string;

  @Column()
  muncipiality: string;

  @Column()
  state: string;

  @Column({nullable: true})
  idFront: string;

  @Column({nullable: true})
  idBackSide: string;

  @Column({nullable: true})
  idNumber: string;

  @Column({nullable: true})
  addressDoc: string;

  @Column({nullable: true})
  isGeo: string;

  @Column({default: false})
  isProfileCompleted: boolean;
}