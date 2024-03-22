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
import {
  CreateSaleListDto,
  CreateRentListDto,
  PropertiesListDto,
  PropertiesFindDto,
} from "./properties.dtos";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Properties } from "./properties.entity";
import { RoleGuard } from "src/auth/role-auth.guard";

@Controller("api/properties")
export class PropertiesController {
  constructor(private readonly properties: PropertiesService) {}

  @UseGuards(JwtAuthGuard, new RoleGuard("owner"))
  @Put("/register/sale")
  async addSale(
    @Request() req,
    @Body() payload: CreateSaleListDto,
  ): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.properties.addSale(
          {
            ...payload,
          },
          req.user,
        ),
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

  @UseGuards(JwtAuthGuard, new RoleGuard("owner"))
  @Put("/register/rent")
  async addRent(
    @Request() req,
    @Body() payload: CreateRentListDto,
  ): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.properties.addRent(
          {
            ...payload,
          },
          req.user,
        ),
        timestamp: new Date().getTime(),
      };
    } catch (e) {
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("/list")
  async list(@Body() body: PropertiesListDto): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.properties.list(body),
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

  @Get("/find")
  async find(@Query() query: PropertiesFindDto): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.properties.find(query.id),
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

  @Get("/my")
  async my(@Request() req): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.properties.my(req.user.id),
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

  @UseGuards(JwtAuthGuard)
  @Post("/like")
  async like(
    @Body() { id }: { id: string },
    @Request() req,
  ): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.properties.like(id, req.user),
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
  @Post("/unlike")
  async unlike(
    @Body() { id }: { id: string },
    @Request() req,
  ): Promise<ISuccessResponse> {
    try {
      return {
        status: "success",
        data: await this.properties.unlike(id, req.user),
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
