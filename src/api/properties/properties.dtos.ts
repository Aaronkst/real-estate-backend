import { IsNotEmpty, IsString } from "class-validator";
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

  @IsString({ each: true })
  @IsNotEmpty()
  images: string[];

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

  @IsString({ each: true })
  @IsNotEmpty()
  indoorFeatures: string[];

  @IsString({ each: true })
  @IsNotEmpty()
  outdoorFeatures: string[];

  @IsString({ each: true })
  @IsNotEmpty()
  climateEnergy: string[];

  boosted?: boolean;
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

export class PropertiesListDto {
  skip?: string;
  listingType?: string;
  price?: string;
  bedrooms?: string;
  bathrooms?: string;
  carparks?: string;
}
