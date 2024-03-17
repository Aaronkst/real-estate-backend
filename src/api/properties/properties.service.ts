import { Injectable } from "@nestjs/common";
import { IPropertyInsert, IPropertyList } from "./properties.interface";

import { InjectRepository } from "@nestjs/typeorm";
import { Between, In, MoreThan, ObjectLiteral, Repository } from "typeorm";
import { Properties } from "./properties.entity";
import { Users } from "../users/users.entity";
import { PropertiesListDto } from "./properties.dtos";

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Properties)
    private properties: Repository<Properties>,
  ) {}

  async addSale(
    payload: IPropertyInsert,
    currentUser: Users,
  ): Promise<Properties> {
    try {
      const properties = new Properties();
      const user = new Users();
      Object.keys(payload).forEach((key) => (properties[key] = payload[key]));
      user.id = currentUser.id;
      properties.availableDate = new Date();
      properties.listBy = user;
      return this.properties.save(properties);
    } catch (e) {
      throw e;
    }
  }

  async addRent(
    payload: IPropertyInsert,
    currentUser: Users,
  ): Promise<Properties> {
    try {
      const properties = new Properties();
      const user = new Users();
      Object.keys(payload).forEach((key) => (properties[key] = payload[key]));
      user.id = currentUser.id;
      properties.availableDate = new Date();
      properties.listBy = user;
      return this.properties.save(properties);
    } catch (e) {
      throw e;
    }
  }

  async list({
    skip,
    fromprice,
    toprice,
    frombed,
    tobed,
    outdoorfeatures,
    indoorfeatures,
    climate,
    keywords,
    ...findOptions
  }: PropertiesListDto): Promise<IPropertyList> {
    try {
      const next = (skip ? parseInt(skip) : 0) + 25;

      // prepare where conditions
      const where: ObjectLiteral = { ...findOptions };

      if (fromprice && toprice) {
        where.price = Between(parseFloat(fromprice), parseFloat(toprice));
      }

      if (frombed && tobed) {
        where.bedrooms = Between(parseFloat(frombed), parseFloat(tobed));
      }

      if (where.bathrooms) where.bathrooms = MoreThan(where.bathrooms);
      if (where.carparks) where.bathrooms = MoreThan(where.carparks);

      // make basic query before array comparing conditions
      const query = this.properties
        .createQueryBuilder("properties")
        .leftJoinAndSelect("properties.listBy", "users")
        .where({
          ...where,
        });

      // array comparisons
      if (outdoorfeatures) {
        query.where("properties.outdoor_features @> (:features)", {
          features: Array.isArray(outdoorfeatures)
            ? outdoorfeatures
            : [outdoorfeatures],
        });
      }
      if (indoorfeatures) {
        query.where("properties.indoor_features @> (:features)", {
          features: Array.isArray(indoorfeatures)
            ? indoorfeatures
            : [indoorfeatures],
        });
      }
      if (climate) {
        query.where("properties.climate_energy @> (:features)", {
          features: Array.isArray(climate) ? climate : [climate],
        });
      }
      if (keywords) {
        query.where("properties.keywords @> (:features)", {
          features: Array.isArray(keywords) ? keywords : [keywords],
        });
      }

      const properties = await query
        .skip(skip ? parseInt(skip) : 0)
        .take(25)
        .orderBy("properties.createdAt", "DESC")
        .orderBy("properties.boosted", "DESC")
        .getMany();

      const count = await this.properties.count();

      return { properties, count, next };
    } catch (e) {
      throw e;
    }
  }

  async find(id: string): Promise<Properties> {
    try {
      const properties = await this.properties.findOneBy({ id });

      return properties;
    } catch (e) {
      throw e;
    }
  }

  async update(id: string, payload: Partial<Properties>): Promise<Properties> {
    try {
      delete payload.id;
      const properties = await this.properties.update(id, payload);
      if (!properties.affected) throw new Error("Not updated");
      return this.properties.findOneBy({ id });
    } catch (e) {
      throw e;
    }
  }
}
