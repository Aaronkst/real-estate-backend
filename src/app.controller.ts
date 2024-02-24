import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { LocalAuthGuard } from "./auth/local-auth.guard";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { randomUUID } from "node:crypto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ISuccessResponse } from "./app.interface";
import { UploadProfilePhotoDto } from "./app.dto";
import { fileUpload } from "./lib/utils";

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("upload/profilePhoto")
  @UseInterceptors(FileInterceptor("file"))
  async uploadProfilePhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() { id }: UploadProfilePhotoDto,
  ): Promise<ISuccessResponse> {
    try {
      const uuid = id ? id : randomUUID();

      const image = fileUpload(file, uuid, "members");

      return {
        status: "success",
        data: { image, id: uuid },
        timestamp: new Date().getTime(),
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post("upload/inventory")
  @UseInterceptors(FileInterceptor("file"))
  async uploadInventory(
    @UploadedFile() file: Express.Multer.File,
    @Body() { id }: UploadProfilePhotoDto,
  ): Promise<ISuccessResponse> {
    try {
      const uuid = id ? id : randomUUID();

      const image = fileUpload(file, uuid, "inventory");

      return {
        status: "success",
        data: { image, id: uuid },
        timestamp: new Date().getTime(),
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
