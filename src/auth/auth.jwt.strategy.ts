import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { UsersService } from "src/api/users/users.service";

interface IPayload {
  id: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private users: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ id }: IPayload) {
    try {
      const user = await this.users.find(id);
      if (!user) throw new Error("Invalid User");
      return { ...user };
    } catch (e) {
      throw e;
    }
  }
}
