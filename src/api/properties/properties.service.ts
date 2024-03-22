import { Injectable } from "@nestjs/common";
import { IPropertyInsert, IPropertyList } from "./properties.interface";

import { InjectRepository } from "@nestjs/typeorm";
import { Between, Like, MoreThan, ObjectLiteral, Repository } from "typeorm";
import { Properties } from "./properties.entity";
import { Users } from "../users/users.entity";
import { PropertiesListDto } from "./properties.dtos";
import { Likes } from "../likes/likes.entity";
import { LikesService } from "../likes/likes.service";

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Properties)
    private properties: Repository<Properties>,
    private likes: LikesService,
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
    name,
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

      if (toprice) {
        where.price = Between(
          fromprice ? parseFloat(fromprice) : 0,
          parseFloat(toprice),
        );
      }

      if (tobed) {
        where.bedrooms = Between(
          frombed ? parseFloat(frombed) : 0,
          parseFloat(tobed),
        );
      }

      if (name) {
        where.name = Like(name);
      }

      if (where.bathrooms) where.bathrooms = MoreThan(where.bathrooms);
      if (where.carparks) where.bathrooms = MoreThan(where.carparks);

      // make basic query before array comparing conditions
      const query = this.properties
        .createQueryBuilder("properties")
        // .leftJoinAndSelect("properties.likes", "likes")
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

  async my(id: string): Promise<Properties[]> {
    try {
      const properties = await this.properties.find({
        where: { listBy: { id } },
      });

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

  async like(id: string, currentUser: Users): Promise<Properties> {
    try {
      const u = new Users();
      u.id = currentUser.id;
      const p = new Properties();
      p.id = id;
      const like = await this.likes.add(u, p);

      const properties = await this.properties.findOneBy({ id });

      const update = await this.properties.update(id, {
        likes: [...properties.likes, like.id],
      });
      if (!update.affected) throw new Error("Not updated");
      return this.properties
        .createQueryBuilder("properties")
        .leftJoinAndSelect("properties.listBy", "users")
        .getOne();
    } catch (e) {
      throw e;
    }
  }

  async unlike(id: string, currentUser: Users): Promise<Properties> {
    try {
      const unlike = await this.likes.delete(currentUser.id, id);

      const properties = await this.properties.findOneBy({ id });
      const likes = [...properties.likes];

      likes.splice(likes.indexOf(unlike));

      const update = await this.properties.update(id, {
        likes,
      });
      if (!update.affected) throw new Error("Not updated");
      return this.properties
        .createQueryBuilder("properties")
        .leftJoinAndSelect("properties.listBy", "users")
        .getOne();
    } catch (e) {
      throw e;
    }
  }
}
