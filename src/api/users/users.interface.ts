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

export type IUserRefresh = {
  user: IUserPublic;
  token: {
    access: {
      token: string;
      expired_at: Date;
    };
    refresh: {
      token: string;
      expired_at: Date;
    };
  };
};
