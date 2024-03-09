import { ArgumentsHost, CanActivate, Injectable } from "@nestjs/common";
import { Observable } from "rxjs/internal/Observable";
import { UsersService } from "src/api/users/users.service";
import { verify, JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private userService: UsersService) {}

  canActivate(context: ArgumentsHost): Promise<boolean> | Observable<boolean> {
    const [socket] = context.getArgs();
    if (!socket) throw new WsException("Unauthorized");
    let bearerToken = (socket as Socket).handshake.headers.authorization;
    if (!bearerToken) throw new WsException("Unauthorized");
    bearerToken = bearerToken.split(" ")[1];
    try {
      const decoded = verify(bearerToken, process.env.JWT_SECRET) as JwtPayload;
      return new Promise((resolve, reject) => {
        return this.userService.verifyUserById(decoded.id).then((user) => {
          if (user) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    } catch (ex) {
      throw new WsException("Unauthorized");
    }
  }
}
