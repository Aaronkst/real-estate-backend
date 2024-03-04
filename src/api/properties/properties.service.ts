import { Injectable } from "@nestjs/common";
import { IPropertyInsert, IPropertyList } from "./properties.interface";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Properties } from "./properties.entity";

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Properties)
    private properties: Repository<Properties>,
  ) {}

  async addSale(payload: IPropertyInsert): Promise<Properties> {
    try {
      const properties = new Properties();
      Object.keys(payload).forEach((key) => (properties[key] = payload[key]));
      return this.properties.save(properties);
    } catch (e) {
      throw e;
    }
  }

  async addRent(payload: IPropertyInsert): Promise<Properties> {
    try {
      const properties = new Properties();
      Object.keys(payload).forEach((key) => (properties[key] = payload[key]));
      return this.properties.save(properties);
    } catch (e) {
      throw e;
    }
  }

  async list(skip?: string): Promise<IPropertyList> {
    try {
      const next = parseInt(skip) + 25;
      const properties = await this.properties.find({
        skip: parseInt(skip),
        take: 25,
        order: {
          createdAt: "ASC",
        },
      });
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
