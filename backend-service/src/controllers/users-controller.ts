import "reflect-metadata";
import { inject } from "inversify";
import {
  Controller,
  Post,
  Put,
  Request as request,
  Response as response,
  Delete,
  Get,
} from "@inversifyjs/http-core";
import { Request, Response } from "express";
import {
  IAddUserRequest,
  IDeleteUserRequest,
  IModifyUserRequest,
} from "../models/users-requests";
import {
  addUserValidator,
  modifyUserValidator,
} from "../models/users-validators";
import { IUserService, userServiceKey } from "../services/user-service";
import { UserRole } from "../models/models";
import { checkUserRole } from "../middlewares/check-user-roles-middleware";

@Controller("/api/v1/user")
@checkUserRole(UserRole.UserManager)
export class UsersController {
  constructor(
    @inject(userServiceKey) private readonly userService: IUserService
  ) {}

  @Post("/")
  async addUser(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    const token = req.headers.authorization || "";
    const basePayload: IAddUserRequest = {
      email: req.body?.email,
      password: req.body?.password,
      roles: req.body?.roles,
    };
    const payload = await addUserValidator.validate(basePayload);
    const response = await this.userService.addUser(payload, token);
    res.status(201).json(response);
  }

  @Put("/")
  async modifyUser(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    const token = req.headers.authorization || "";
    const basePayload: IModifyUserRequest = {
      email: req.body?.email,
      isActive: req.body?.isActive,
      password: req.body?.password,
      roles: req.body?.roles,
    };
    const payload = await modifyUserValidator.validate(basePayload);
    const response = await this.userService.modifyUser(payload, token);
    res.status(200).json(response);
  }

  @Delete("/:email")
  async deleteUser(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    const token = req.headers.authorization || "";
    const basePayload: IDeleteUserRequest = {
      email: req.params.email,
    };
    const payload = await modifyUserValidator.validate(basePayload);
    const response = await this.userService.deleteUser(payload, token);
    res.status(200).json(response);
  }

  @Get("/")
  async listUsers(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    const token = req.headers.authorization || "";
    const users = await this.userService.listUsers(token);
    res.status(200).json(users);
  }
}
