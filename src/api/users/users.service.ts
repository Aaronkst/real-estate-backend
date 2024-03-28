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
import { CreateUserDto } from "./users.dtos";
import { Contacts } from "../contact/contact.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private users: Repository<Users>,

    @InjectRepository(Contacts)
    private contacts: Repository<Contacts>,

    private jwtService: JwtService,
  ) {}

  async add(
    payload: CreateUserDto & { files: Express.Multer.File[] },
  ): Promise<IUserPublic> {
    try {
      const { phone, address, address2, identification, files } = payload;

      const C = new Contacts();
      C.phone = phone;
      C.address = address;
      C.address2 = address2;
      C.identificaton = identification;

      /* 
        Upload all files and append url's as array into C.files;
      */

      const savedC = await this.contacts.save(C);

      const contact = new Contacts();
      contact.id = savedC.id;

      const user = new Users();
      Object.keys(payload).forEach((key) => (user[key] = payload[key]));
      user.contact = contact;
      return this.users.save(user);
    } catch (e) {
      throw e;
    }
  }

  async list(skip?: string): Promise<IUserList> {
    try {
      // const users = await this.users.find({
      //   select,
      //   order: {
      //     createdAt: "ASC",
      //   },
      // });

      const users = await this.users
        .createQueryBuilder("users")
        .leftJoinAndSelect("users.contact", "contacts")
        .skip(skip ? parseInt(skip) : 0)
        .take(25)
        .orderBy("users.createdAt", "ASC")
        .getMany();

      return { users, count: users.length };
    } catch (e) {
      throw e;
    }
  }

  // async listGist(): Promise<IUserList> {
  //   try {
  //     const users = await this.users.find({
  //       where: {
  //         active: true,
  //       },
  //       select: {
  //         id: true,
  //         name: true,
  //       },
  //       order: {
  //         createdAt: "ASC",
  //       },
  //     });

  //     return { users, count: users.length };
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  async find(id: string): Promise<Users> {
    try {
      return await this.users
        .createQueryBuilder("users")
        .leftJoinAndSelect("users.contact", "contacts")
        .where("users.id::text = :id", { id })
        .orderBy("users.createdAt", "ASC")
        .getOne();
    } catch (e) {
      throw e;
    }
  }

  async update(id: string, payload: Partial<Users>): Promise<Users> {
    try {
      delete payload.id;
      const user = await this.users.update(id, payload);
      if (!user.affected) throw new Error("Not updated");
      return await this.users
        .createQueryBuilder("users")
        .leftJoinAndSelect("users.contact", "contacts")
        .where("users.id::text = :id", { id })
        .orderBy("users.createdAt", "ASC")
        .getOne();
    } catch (e) {
      throw e;
    }
  }

  async addContact(): Promise<Users> {
    try {
      return;
      // const user = await this.users.update(id, payload);
      // if (!user.affected) throw new Error("Not updated");
      // return await this.users
      //   .createQueryBuilder("users")
      //   .leftJoinAndSelect("users.contact", "contacts")
      //   .where("users.id::text = :id", { id })
      //   .orderBy("users.createdAt", "ASC")
      //   .getOne();
    } catch (e) {
      throw e;
    }
  }

  async uploadImage(id: string, image: Express.Multer.File): Promise<Users> {
    try {
      const upload = await uploadFile(image, "user");
      const user = await this.users.update(id, { image: upload });
      if (!user.affected) throw new Error("Not updated");
      return await this.users
        .createQueryBuilder("users")
        .leftJoinAndSelect("users.contact", "contacts")
        .where("users.id::text = :id", { id })
        .orderBy("users.createdAt", "ASC")
        .getOne();
    } catch (e) {
      throw e;
    }
  }

  async validateUser(email: string, password: string): Promise<IUserPublic> {
    try {
      const user = await this.users.findOne({
        where: { email, active: true },
        select: { id: true, password: true },
      });
      if (!user) throw new Error("Invalid User");
      const isValid: boolean = await user.validatePassword(password);
      if (!isValid) throw new Error("Invalid Password");
      return await this.users
        .createQueryBuilder("users")
        .leftJoinAndSelect("users.contact", "contacts")
        .where("users.id::text = :id", { id: user.id })
        .orderBy("users.createdAt", "ASC")
        .getOne();
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
      const user = await this.users.findOneBy({
        refreshToken: token,
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
        user: await this.users
          .createQueryBuilder("users")
          .leftJoinAndSelect("users.contact", "contacts")
          .where("users.id::text = :id", { id: user.id })
          .orderBy("users.createdAt", "ASC")
          .getOne(),
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
