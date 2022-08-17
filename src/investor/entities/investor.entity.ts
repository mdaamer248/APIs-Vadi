import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique
  } from 'typeorm';

@Entity()
@Unique(['email'])
export class Investor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({default: false})
  isConfirmed: boolean;

  @Column({nullable: true})
  validationCode : number;

  @Column({nullable: true})
  otpIssuedAt : number;

  @Column({nullable: true})
  resetToken: string;

  @Column({nullable: true})
  resetTokenIssuedAt : number;
}
