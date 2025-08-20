import "reflect-metadata";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  request,
  response,
} from "inversify-express-utils";
import { Request, Response } from "express";
import {
  appConfigServiceKey,
  IAppConfigService,
} from "../services/app-config-service";
import {
  IAuthenticateRequest,
  IRefreshTokenRequest,
} from "../models/users-requests";
import {
  authenticateValidator,
  refreshTokenValidator,
} from "../models/users-validators";
import { IUserService, userServiceKey } from "../services/user-service";
import { checkToken } from "../middlewares/check-token-middleware";
import { ITokenService, tokenServiceKey } from "../services/token-service";

@controller("/api/v1/auth")
export class AuthenticationController extends BaseHttpController {
  constructor(
    @inject(appConfigServiceKey) private readonly appConfig: IAppConfigService,
    @inject(tokenServiceKey) private readonly tokenService: ITokenService,
    @inject(userServiceKey) private readonly userService: IUserService,
  ) {
    super();
  }

  @httpPost("/token")
  async authenticate(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const basePayload: IAuthenticateRequest = {
      email: req.body?.email,
      password: req.body?.password,
    };
    const requestPayload = await authenticateValidator.validate(basePayload);
    const response = await this.userService.authenticate(requestPayload);
    res.status(200).json(response);
  }

  @httpGet("/tokenInfos")
  @checkToken()
  async getUserInfos(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const token = req.headers.authorization || "";
    const response = await this.tokenService.validateToken(token);
    res.status(200).json(response);
  }

  @httpPost("/refreshToken")
  async refreshToken(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const baseRequest: IRefreshTokenRequest = {
      refreshToken: req.body.refreshToken,
    };
    const refreshTokenRequest =
      await refreshTokenValidator.validate(baseRequest);
    const response = await this.userService.refreshToken(refreshTokenRequest);
    res.status(200).json(response);
  }
}
