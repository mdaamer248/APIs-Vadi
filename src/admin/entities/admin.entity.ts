import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique
  } from 'typeorm';

@Entity()
@Unique(['email'])
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({nullable: true})
  resetToken: string;

  @Column({nullable: true})
  resetTokenIssuedAt : number;

}
