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
} from "typeorm";
import { hash, compare } from "bcrypt";

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

  @Column()
  name: string;

  @Column()
  password: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

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
