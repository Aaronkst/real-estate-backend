import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PropertiesService } from "./properties.service";
import { Properties } from "./properties.entity";
import { PropertiesController } from "./properties.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Properties])],
  providers: [PropertiesService],
  exports: [PropertiesService],
  controllers: [PropertiesController],
})
export class PropertiesModule {}
