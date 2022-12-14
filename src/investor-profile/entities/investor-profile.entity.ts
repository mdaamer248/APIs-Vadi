import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique
} from 'typeorm';
import { InvestorLevel } from './investor-level.enum';

@Entity()
@Unique(['email'])
export class InvestorProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ type: "enum", enum: InvestorLevel, default: InvestorLevel.LevelOne})
  investorLevel: InvestorLevel;

  @Column({nullable: true})
  fundAmount: number;

  @Column({nullable: true})
  totalAmountFunded : number;
  
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  dateOfBirth: string;

  @Column()
  countryOfBirth: string;

  @Column()
  nationality: string;

  @Column({nullable: true})
  cURP: number;

  @Column({ nullable: true})
  rFC: number;

  @Column()
  phoneNumber: number;

  @Column()
  occupation: string;

  @Column()
  homeAddress: string;

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
}