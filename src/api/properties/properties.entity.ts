import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import {
  IPropertySaleEstablished,
  IPropertySaleMethod,
  IPropertyTypes,
} from "./properties.interface";

@Entity()
export class Properties {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "list_by" })
  listBy: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: "cover_image", type: "text", array: true })
  coverImage: string;

  @Column({ type: "text", array: true })
  images: string;

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

  @Column({ name: "sale_established" })
  saleEstablished: IPropertySaleEstablished;

  @Column({ name: "sale_is_offered", type: "boolean", default: false })
  saleIsOffered?: boolean;

  @Column({ name: "sale_method" })
  saleMethod: IPropertySaleMethod;

  @Column({ name: "rent_furnished", type: "boolean" })
  rentFurnished: boolean;

  @Column({ name: "rent_pets", type: "boolean" })
  rentPets: boolean;

  @Column({ name: "rent_deposit", type: "boolean" })
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

  @Column({ type: "text", array: true })
  keywords: string;

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
