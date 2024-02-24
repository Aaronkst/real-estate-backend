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
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ISuccessResponse } from "../../app.interface";
import { CreateUserDto } from "./users.dtos";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

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
  async list(): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.users.list(),
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
  async find(@Request() req): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.users.find(req.user.id),
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
  @Get("/listGist")
  async listUserGist(): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.users.listGist(),
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
}
