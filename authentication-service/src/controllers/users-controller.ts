import "reflect-metadata";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpPost,
  httpPut,
  request,
  response,
  httpDelete,
} from "inversify-express-utils";
import { Request, Response } from "express";
import {
  IAddUserRequest,
  IDeleteUserRequest,
  IModifyUserRequest,
} from "../models/requests";
import { addUserValidator, modifyUserValidator } from "../models/validators";
import { IUserService, userServiceKey } from "../services/user-service";
import { UserRole } from "../models/models";
import { checkUserRole } from "../middlewares/check-user-roles-middleware";

@controller("/api/v1/user")
@checkUserRole(UserRole.UserManager)
export class UsersController extends BaseHttpController {
  constructor(
    @inject(userServiceKey) private readonly userService: IUserService,
  ) {
    super();
  }

  @httpPost("/")
  async addUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const basePayload: IAddUserRequest = {
      email: req.body.email,
      password: req.body.password,
      roles: req.body.roles,
    };
    const payload = await addUserValidator.validate(basePayload);
    const response = await this.userService.addUser(payload);
    res.status(201).json(response);
  }

  @httpPut("/")
  async modifyUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const basePayload: IModifyUserRequest = {
      email: req.body.email,
      isActive: req.body.isActive,
      password: req.body.password,
      roles: req.body.roles,
    };
    const payload = await modifyUserValidator.validate(basePayload);
    const response = await this.userService.modifyUser(payload);
    res.status(200).json(response);
  }

  @httpDelete("/:email")
  async deleteUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const basePayload: IDeleteUserRequest = {
      email: req.params.email,
    };
    const payload = await modifyUserValidator.validate(basePayload);
    const response = await this.userService.deleteUser(payload);
    res.status(200).json(response);
  }
}
