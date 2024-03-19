import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
      const likes = new Likes();
      likes.user = user;
      likes.property = property;
      return this.likes.save(likes);
    } catch (e) {
      console.log("like service e:", e);
      throw e;
    }
  }
}
