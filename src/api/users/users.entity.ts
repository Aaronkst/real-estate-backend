import { IsEmail } from "class-validator";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterInsert,
  AfterUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { hash, compare } from "bcrypt";
import { Contacts } from "../contact/contact.entity";

@Entity()
export class Users {
  @BeforeUpdate()
  @BeforeInsert()
  async bcryptPassword() {
    this.password = await hash(this.password, 10);
  }

  @AfterInsert()
  @AfterUpdate()
  async removePassword() {
    if (this.password) delete this.password;
  }

  async validatePassword(password: string): Promise<boolean> {
    const isValid = await compare(password, this.password);
    return isValid ? true : false;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Contacts, (contact) => contact.id, { nullable: true })
  @JoinColumn()
  contact?: Contacts;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ name: "is_paid", default: false, type: "boolean" })
  isPaid?: boolean;

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt?: Date;

  @Column({ default: true })
  active?: boolean;
}
