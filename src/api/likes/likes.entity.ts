import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Users } from "../users/users.entity";
import { Properties } from "../properties/properties.entity";

@Entity()
export class Likes {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn()
  user: Users;

  @ManyToOne(() => Properties, (property) => property.id)
  @JoinColumn()
  property: Properties;

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
