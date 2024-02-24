import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { Users } from "./users.entity";
import { UsersController } from "./users.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
