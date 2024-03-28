import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { Users } from "./users.entity";
import { UsersController } from "./users.controller";
import { JwtModule } from "@nestjs/jwt";
import { Contacts } from "../contact/contact.entity";

const JWT = JwtModule.register({
  secret: process.env.JWT_SECRET,
});

@Module({
  imports: [TypeOrmModule.forFeature([Users, Contacts]), JWT],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
