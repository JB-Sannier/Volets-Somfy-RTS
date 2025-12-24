import "reflect-metadata";
import { inject } from "inversify";
import {
  Controller,
  Get,
  Post,
  Request as request,
  Response as response,
} from "@inversifyjs/http-core";

import { Request, Response } from "express";
import {
  appConfigServiceKey,
  IAppConfigService,
} from "../services/app-config-service";
import { IAuthenticateRequest, IRefreshTokenRequest } from "../models/requests";
import {
  authenticateValidator,
  refreshTokenValidator,
} from "../models/validators";
import { IUserService, userServiceKey } from "../services/user-service";
import {
  checkToken,
  IAuthentifiedRequest,
} from "../middlewares/check-token-middleware";
import {
  IRefreshTokenService,
  refreshTokenServiceKey,
} from "../services/refresh-token-sevice";

@Controller("/api/v1/auth")
export class AuthenticationController {
  constructor(
    @inject(appConfigServiceKey) private readonly appConfig: IAppConfigService,
    @inject(userServiceKey) private readonly userService: IUserService,
    @inject(refreshTokenServiceKey)
    private readonly refreshTokenService: IRefreshTokenService,
  ) {}

  @Post("/token")
  async authenticate(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const basePayload: IAuthenticateRequest = {
      email: req.body.email,
      password: req.body.password,
    };
    const requestPayload = await authenticateValidator.validate(basePayload);
    const response = await this.userService.authenticate(requestPayload);
    res.status(200).json(response);
  }

  @Get("/config")
  @checkToken()
  async getConfig(
    @request() req: IAuthentifiedRequest,
    @response() res: Response,
  ): Promise<void> {
    const user = req.tokenInfos;

    const response = {
      dbHostname: this.appConfig.dbHostName(),
      dbPort: this.appConfig.dbPort(),
      dbUserName: this.appConfig.dbUserName(),
      dbSchema: this.appConfig.dbSchema(),
      user: {
        email: user.email,
        roles: user.roles,
      },
    };
    res.status(200).json(response);
  }

  @Get("/tokenInfos")
  @checkToken()
  async getUserInfos(
    @request() req: IAuthentifiedRequest,
    @response() res: Response,
  ): Promise<void> {
    const user = req.tokenInfos;
    res.status(200).json({
      email: user.email,
      roles: user.roles,
    });
  }

  @Post("/refreshToken")
  async refreshToken(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const baseRequest: IRefreshTokenRequest = {
      refreshToken: req.body.refreshToken,
    };
    const refreshTokenRequest =
      await refreshTokenValidator.validate(baseRequest);
    const response =
      await this.refreshTokenService.refreshToken(refreshTokenRequest);

    res.status(200).json(response);
  }
}
