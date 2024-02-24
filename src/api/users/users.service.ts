import { Injectable } from "@nestjs/common";
import { IUserInsert, IUserList, IUserPublic } from "./users.interface";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Users } from "./users.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private users: Repository<Users>,
  ) {}

  async add(payload: IUserInsert): Promise<IUserPublic> {
    try {
      const user = new Users();
      Object.keys(payload).forEach((key) => (user[key] = payload[key]));
      return this.users.save(user);
    } catch (e) {
      throw e;
    }
  }

  async list(): Promise<IUserList> {
    try {
      const users = await this.users.find({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          active: true,
        },
        order: {
          createdAt: "ASC",
        },
      });

      return { users, count: users.length };
    } catch (e) {
      throw e;
    }
  }

  async listGist(): Promise<IUserList> {
    try {
      const users = await this.users.find({
        where: {
          active: true,
        },
        select: {
          id: true,
          name: true,
        },
        order: {
          createdAt: "ASC",
        },
      });

      return { users, count: users.length };
    } catch (e) {
      throw e;
    }
  }

  async find(id: string): Promise<Users> {
    try {
      const users = await this.users.findOneBy({ id });
      delete users.password;

      return users;
    } catch (e) {
      throw e;
    }
  }

  async update(id: string, payload: Partial<Users>): Promise<Users> {
    try {
      delete payload.id;
      const user = await this.users.update(id, payload);
      if (!user.affected) throw new Error("Not updated");
      return this.users.findOneBy({ id });
    } catch (e) {
      throw e;
    }
  }

  async validateUser(email: string, password: string): Promise<IUserPublic> {
    try {
      const user = await this.users.findOneBy({ email, active: true });
      if (!user) throw new Error("Invalid User");
      const isValid: boolean = await user.validatePassword(password);
      if (!isValid) throw new Error("Invalid Password");
      if (user.password) delete user.password;
      return user;
    } catch (e) {
      throw e;
    }
  }

  async verifyUserById(id: string): Promise<boolean> {
    try {
      const user = await this.users.findOneBy({ id });
      if (!user) return false;
      return true;
    } catch {
      return false;
    }
  }
}
