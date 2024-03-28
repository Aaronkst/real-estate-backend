import { Users } from "./users.entity";

export type IUserList = { users: Users[]; count: number };

export type IUserPublic = Omit<Users, "password">;

export type IUserInsert = Partial<Users>;

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
