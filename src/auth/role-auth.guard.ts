import {
  ArgumentsHost,
  CanActivate,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private type: string | string[]) {}

  canActivate(context: ArgumentsHost): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
    try {
      return this.type.includes(user.type);
    } catch (ex) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
  }
}
