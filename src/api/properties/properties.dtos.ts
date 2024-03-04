import { IsNotEmpty } from "class-validator";
import {
  IPropertySaleEstablished,
  IPropertySaleMethod,
  IPropertyTypes,
} from "./properties.interface";

class CreateListingDto {
  @IsNotEmpty()
  name: string;

  description?: string;

  @IsNotEmpty()
  coverImage: string;

  @IsNotEmpty()
  images: string;

  @IsNotEmpty()
  address: string;

  address2?: string;

  @IsNotEmpty()
  town: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  postcode: string;

  @IsNotEmpty()
  buildingType: string;

  @IsNotEmpty()
  listingType: IPropertyTypes;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  bedrooms: number;

  @IsNotEmpty()
  bathrooms: number;

  carparks?: number;

  @IsNotEmpty()
  width: number;

  @IsNotEmpty()
  length: number;

  @IsNotEmpty()
  height: number;

  @IsNotEmpty()
  indoorFeatures: string[];

  @IsNotEmpty()
  outdoorFeatures: string[];

  @IsNotEmpty()
  climateEnergy: string[];
}

export class CreateSaleListDto extends CreateListingDto {
  @IsNotEmpty()
  saleEstablished: IPropertySaleEstablished;

  saleIsOffered?: boolean;

  @IsNotEmpty()
  saleMethod: IPropertySaleMethod;
}

export class CreateRentListDto extends CreateListingDto {
  @IsNotEmpty()
  rentFurnished: boolean;

  @IsNotEmpty()
  rentPets: boolean;

  @IsNotEmpty()
  rentDeposit: boolean;
}
