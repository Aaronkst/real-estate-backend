import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PropertiesService } from "./properties.service";
import { Properties } from "./properties.entity";
import { PropertiesController } from "./properties.controller";
import { LikesService } from "../likes/likes.service";
import { Likes } from "../likes/likes.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Properties, Likes])],
  providers: [PropertiesService, LikesService],
  exports: [PropertiesService, LikesService],
  controllers: [PropertiesController],
})
export class PropertiesModule {}
