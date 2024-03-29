import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";

import { Users } from "./api/users/users.entity";
import { UsersModule } from "./api/users/users.module";

import { LikesModule } from "./api/likes/likes.module";
import { Likes } from "./api/likes/likes.entity";

import { Properties } from "./api/properties/properties.entity";
import { PropertiesModule } from "./api/properties/properties.module";

import { Contacts } from "./api/contact/contact.entity";

import { AuthModule } from "./auth/auth.module";

import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

const ENV: DynamicModule = ConfigModule.forRoot({
  envFilePath:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

const DATABASE: DynamicModule = TypeOrmModule.forRoot({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Users, Likes, Properties, Contacts],
  synchronize: true,
});

const STATIC: DynamicModule = ServeStaticModule.forRoot({
  rootPath: join(__dirname, "..", "static"),
});

@Module({
  imports: [
    ENV,
    DATABASE,
    STATIC,
    UsersModule,
    PropertiesModule,
    LikesModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
