import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { Likes } from "./likes.entity";
import { Users } from "../users/users.entity";
import { Properties } from "../properties/properties.entity";

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Likes)
    private likes: Repository<Likes>,
  ) {}

  async add(user: Users, property: Properties): Promise<Likes> {
    try {
      const like = this.likes.findOne({
        where: { user: { id: user.id }, property: { id: property.id } },
      });
      if (like) throw new Error("Already liked!");

      const likes = new Likes();
      likes.user = user;
      likes.property = property;
      return this.likes.save(likes);
    } catch (e) {
      throw e;
    }
  }

  async delete(user: string, property: string): Promise<string> {
    try {
      const like = await this.likes.findOne({
        where: { user: { id: user }, property: { id: property } },
      });
      if (!like) throw new Error("Not liked!");

      const unlike = await this.likes.delete({
        user: { id: user },
        property: { id: property },
      });

      if (!unlike.affected) throw new Error("Unexpected");

      return like.id;
    } catch (e) {
      throw e;
    }
  }
}
