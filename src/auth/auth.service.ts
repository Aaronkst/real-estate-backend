import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IUserPublic, IUserRefresh } from "../api/users/users.interface";
import { UsersService } from "../api/users/users.service";
import { randomUUID } from "crypto";

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<IUserPublic> {
    try {
      const user = await this.users.validateUser(email, password);
      if (user) {
        return user;
      }
      return null;
    } catch (e) {
      if (e.message === "Invalid User")
        throw new HttpException(e.message, HttpStatus.NOT_FOUND);
      if (e.message === "Invalid Password")
        throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(user: IUserPublic): Promise<IUserRefresh> {
    const expiredAt = new Date();

    const accessExpired = new Date(
      expiredAt.setDate(expiredAt.getHours() + 24),
    );
    const refreshExpired = new Date(expiredAt.setDate(expiredAt.getDate() + 7));

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
  }
}
