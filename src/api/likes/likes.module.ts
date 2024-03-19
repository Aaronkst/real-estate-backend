import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LikesService } from "./likes.service";
import { Likes } from "./likes.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Likes])],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
