import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique
  } from 'typeorm';
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({nullable :true})
    dailCode: number;

    @Column({type:"bigint"})
    mobile: number;

    @Column()
    smsOtp: number;
}  