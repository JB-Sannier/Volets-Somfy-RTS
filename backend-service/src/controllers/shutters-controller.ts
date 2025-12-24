import "reflect-metadata";
import { inject } from "inversify";
import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request as request,
  Response as response,
} from "@inversifyjs/http-core";
import {} from "@inversifyjs/http-express";

import { Request, Response } from "express";
import { UserRole } from "../models/models";
import { checkUserRole } from "../middlewares/check-user-roles-middleware";
import {
  IAddShutterRequest,
  IDeleteShutterRequest,
  IGetShutterRequest,
  IModifyShutterRequest,
} from "../models/shutters-requests";

import {
  addShutterValidator,
  deleteShutterValidator,
  getShutterValidator,
  modifyShutterValidator,
} from "../models/shutters-validators";
import {
  IShuttersProxyService,
  shuttersProxyServiceKey,
} from "../services/shutters-proxy-service";
import { checkToken } from "../middlewares/check-token-middleware";

@Controller("/api/v1/shutter")
export class ShuttersController {
  constructor(
    @inject(shuttersProxyServiceKey)
    private readonly shutterService: IShuttersProxyService,
  ) {}

  @Get("/")
  @checkToken()
  async listShutters(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const shutters = await this.shutterService.listShutters();
    res.status(200).json(shutters);
  }

  @Get("/:shutterId")
  @checkToken()
  async getShutter(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const requestPayload: IGetShutterRequest = {
      shutterId: req.params.shutterId,
    };
    const getShutterRequest =
      await getShutterValidator.validate(requestPayload);
    const shutter = await this.shutterService.getShutter(getShutterRequest);
    res.status(200).json(shutter);
  }

  @Post("/")
  @checkUserRole(UserRole.ShuttersProgrammer)
  async addShutter(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const basePayload: IAddShutterRequest = {
      shutterName: req.body?.shutterName,
    };
    const payload = await addShutterValidator.validate(basePayload);
    const response = await this.shutterService.addShutter(payload);
    res.status(201).json(response);
  }

  @Put("/")
  @checkUserRole(UserRole.ShuttersProgrammer)
  async modifyUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const basePayload: IModifyShutterRequest = {
      shutterId: req.body?.shutterId,
      shutterName: req.body?.shutterName,
    };
    const payload = await modifyShutterValidator.validate(basePayload);
    const response = await this.shutterService.modifyShutter(payload);
    res.status(200).json(response);
  }

  @Delete("/:shutterId")
  @checkUserRole(UserRole.ShuttersProgrammer)
  async deleteUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const basePayload: IDeleteShutterRequest = {
      shutterId: req.params.shutterId,
    };
    const payload = await deleteShutterValidator.validate(basePayload);
    const response = await this.shutterService.deleteShutter(payload);
    res.status(200).json(response);
  }
}
