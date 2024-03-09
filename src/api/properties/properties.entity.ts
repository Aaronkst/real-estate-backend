import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import {
  IPropertySaleEstablished,
  IPropertySaleMethod,
  IPropertyTypes,
} from "./properties.interface";
import { Users } from "../users/users.entity";

@Entity()
export class Properties {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: "list_by" })
  listBy: Users;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: "cover_image", type: "text" })
  coverImage: string;

  @Column({ type: "text", array: true })
  images: string[];

  @Column()
  address: string;

  @Column({ nullable: true })
  address2?: string;

  @Column()
  town: string;

  @Column()
  city: string;

  @Column()
  postcode: string;

  @Column({ name: "building_type" })
  buildingType: string;

  @Column({ name: "listing_type" })
  listingType: IPropertyTypes;

  @Column({ name: "sale_established", nullable: true })
  saleEstablished: IPropertySaleEstablished;

  @Column({ name: "sale_is_offered", type: "boolean", default: false })
  saleIsOffered?: boolean;

  @Column({ name: "sale_method", nullable: true })
  saleMethod: IPropertySaleMethod;

  @Column({ name: "rent_furnished", type: "boolean", default: false })
  rentFurnished: boolean;

  @Column({ name: "rent_pets", type: "boolean", default: false })
  rentPets: boolean;

  @Column({ name: "rent_deposit", type: "boolean", default: false })
  rentDeposit: boolean;

  @Column()
  price: number;

  @Column()
  bedrooms: number;

  @Column()
  bathrooms: number;

  @Column({ nullable: true })
  carparks?: number;

  @Column()
  width: number;

  @Column()
  length: number;

  @Column()
  height: number;

  @Column({ name: "available_date" })
  availableDate: Date;

  @Column({ name: "indoor_features", type: "text", array: true })
  indoorFeatures: string[];

  @Column({ name: "outdoor_features", type: "text", array: true })
  outdoorFeatures: string[];

  @Column({ name: "climate_energy", type: "text", array: true })
  climateEnergy: string[];

  @Column({ type: "text", array: true, default: [] })
  keywords: string[];

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

  @Column({ type: "boolean", default: false })
  boosted?: boolean;
}
