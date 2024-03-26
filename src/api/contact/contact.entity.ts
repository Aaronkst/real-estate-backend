import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from "typeorm";

@Entity()
export class Contacts {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  phone: number;

  @Column()
  address: string;

  @Column({ name: "address_2", nullable: true })
  address2?: string;

  @Column({ unique: true })
  identificaton: string; // Passport | NRC Number

  @Column({ type: "text", array: true, default: [] })
  files: string[];

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
}
