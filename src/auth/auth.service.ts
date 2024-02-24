import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IUserPublic } from "../api/users/users.interface";
import { UsersService } from "../api/users/users.service";

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

  async login(user: IUserPublic) {
    const payload = { id: user.id };
    const expiresIn = "24h";
    const expiredAt = new Date();
    return {
      user,
      access_token: this.jwtService.sign(payload, { expiresIn }),
      expired_at: expiredAt.setHours(expiredAt.getHours() + 24),
    };
  }
}
