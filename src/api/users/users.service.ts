import { Injectable } from "@nestjs/common";
import {
  IUserInsert,
  IUserList,
  IUserPublic,
  IUserRefresh,
} from "./users.interface";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Users } from "./users.entity";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { uploadFile } from "src/lib/storage";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private users: Repository<Users>,
    private jwtService: JwtService,
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
      const select = {
        id: true,
        name: true,
        email: true,
        image: true,
        type: true,
        isAgent: true,
        refreshToken: true,
        createdAt: true,
        updatedAt: true,
        active: true,
      };
      const users = await this.users.find({
        select,
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
      const select = {
        id: true,
        name: true,
        email: true,
        image: true,
        type: true,
        isAgent: true,
        refreshToken: true,
        createdAt: true,
        updatedAt: true,
        active: true,
      };
      return this.users.findOne({ where: { id }, select });
    } catch (e) {
      throw e;
    }
  }

  async update(id: string, payload: Partial<Users>): Promise<Users> {
    try {
      delete payload.id;
      const user = await this.users.update(id, payload);
      if (!user.affected) throw new Error("Not updated");

      const select = {
        id: true,
        name: true,
        email: true,
        image: true,
        type: true,
        isAgent: true,
        refreshToken: true,
        createdAt: true,
        updatedAt: true,
        active: true,
      };
      return this.users.findOne({ where: { id }, select });
    } catch (e) {
      throw e;
    }
  }

  async uploadImage(id: string, image: Express.Multer.File): Promise<Users> {
    try {
      const upload = await uploadFile(image, "user");
      const user = await this.users.update(id, { image: upload });
      if (!user.affected) throw new Error("Not updated");

      const select = {
        id: true,
        name: true,
        email: true,
        image: true,
        type: true,
        isAgent: true,
        refreshToken: true,
        createdAt: true,
        updatedAt: true,
        active: true,
      };
      return this.users.findOne({ where: { id }, select });
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

  async refresh(token: string): Promise<IUserRefresh> {
    try {
      const isValidToken = this.jwtService.verify(token, {
        ignoreExpiration: false,
        secret: process.env.JWT_SECRET,
      });
      if (!isValidToken) throw new Error("Invalid Token");

      const select = {
        id: true,
        name: true,
        email: true,
        image: true,
        type: true,
        isAgent: true,
        refreshToken: true,
        createdAt: true,
        updatedAt: true,
        active: true,
      };
      const user = await this.users.findOne({
        where: { refreshToken: token },
        select,
      });
      if (!user) throw new Error("Invalid Token");

      const expiredAt = new Date();

      const accessExpired = new Date(
        expiredAt.setDate(expiredAt.getHours() + 24),
      );
      const refreshExpired = new Date(
        expiredAt.setDate(expiredAt.getDate() + 7),
      );

      const refreshToken = randomUUID();

      await this.users.update(user.id, { refreshToken });

      const accessPayload = { id: user.id };
      const refreshPayload = { token: refreshToken };

      return {
        user,
        token: {
          access: {
            token: this.jwtService.sign(accessPayload, { expiresIn: "24h" }),
            expired_at: accessExpired,
          },
          refresh: {
            token: this.jwtService.sign(refreshPayload, {
              expiresIn: "1week",
            }),
            expired_at: refreshExpired,
          },
        },
      };
    } catch (e) {
      throw e;
    }
  }
}
