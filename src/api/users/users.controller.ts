import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus,
  Get,
  UseGuards,
  Request,
  Put,
  UseInterceptors,
  UploadedFile,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ISuccessResponse } from "../../app.interface";
import { CreateUserDto, FindUserDto, ListUserDto } from "./users.dtos";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("api/users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // @UseGuards(JwtAuthGuard)
  @Put("/register")
  async add(@Body() payload: CreateUserDto): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.users.add({
          ...payload,
        }),
        timestamp: new Date().getTime(),
      };
    } catch (e) {
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("/list")
  async list(@Query() { skip }: ListUserDto): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.users.list(skip),
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
  @Get("/find")
  async find(@Query() { id }: FindUserDto): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.users.find(id),
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

  // @UseGuards(JwtAuthGuard)
  // @Get("/listGist")
  // async listUserGist(): Promise<ISuccessResponse> {
  //   try {
  //     return {
  //       status: "success",
  //       data: await this.users.listGist(),
  //       timestamp: new Date().getTime(),
  //     };
  //   } catch (e) {
  //     console.log(e);
  //     throw new HttpException(
  //       "Internal Server Error",
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  @UseGuards(JwtAuthGuard)
  @Post("/update")
  async update(
    @Body() payload: { id: string } & Partial<CreateUserDto>,
  ): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.users.update(payload.id, payload),
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
  @Put("/profile/upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadProfilePhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() { id }: { id: string },
  ): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.users.uploadImage(id, file),
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

  @Post("/refresh")
  async refresh(
    @Body() { token }: { token: string },
  ): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.users.refresh(token),
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
