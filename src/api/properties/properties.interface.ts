import { Properties } from "./properties.entity";

export type IPropertyTypes = "sale" | "rent";

export type IPropertySaleEstablished = "new" | "established";

export type IPropertySaleMethod = "private" | "auction";

export type IPropertyList = {
  properties: (Properties & { isLiked?: boolean })[];
  count: number;
  next: number;
};

export type IPropertyInsert = Partial<Properties>;
