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
  Query,
} from "@nestjs/common";
import { PropertiesService } from "./properties.service";
import { ISuccessResponse } from "../../app.interface";
import { CreateSaleListDto, CreateRentListDto } from "./properties.dtos";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Properties } from "./properties.entity";

@Controller("api/properties")
export class PropertiesController {
  constructor(private readonly properties: PropertiesService) {}

  @UseGuards(JwtAuthGuard)
  @Put("/register/sale")
  async addSale(
    @Request() req,
    @Body() payload: CreateSaleListDto,
  ): Promise<ISuccessResponse> {
    try {
      const { user } = req;
      return {
        status: "success",
        data: await this.properties.addSale({
          listBy: user.id,
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
  @Put("/register/rent")
  async addRent(
    @Request() req,
    @Body() payload: CreateRentListDto,
  ): Promise<ISuccessResponse> {
    try {
      const { user } = req;
      return {
        status: "success",
        data: await this.properties.addRent({
          listBy: user.id,
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
  async list(@Query() query): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.properties.list(query.skip || "0"),
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
        data: await this.properties.find(req.user.id),
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
    @Body() payload: { id: string } & Partial<Properties>,
  ): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.properties.update(payload.id, payload),
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
