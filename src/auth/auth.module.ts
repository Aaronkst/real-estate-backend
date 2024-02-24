import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../api/users/users.module";
import { LocalStrategy } from "./auth.local.strategy";
import { JwtStrategy } from "./auth.jwt.strategy";
import { AuthService } from "./auth.service";

const ENV: DynamicModule = ConfigModule.forRoot({
  envFilePath:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

const JWT = JwtModule.register({
  secret: process.env.JWT_SECRET,
});

@Module({
  imports: [ENV, UsersModule, PassportModule, JWT],
  exports: [AuthService],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
