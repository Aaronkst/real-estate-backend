import { Users } from "./users.entity";

export type IUser = {
  id: string;
  name: string;
  password: string;
  email: string;
};

export type IUserList = { users: Users[]; count: number };

export type IUserPublic = Omit<IUser, "password">;

export type IUserInsert = Partial<IUser>;
