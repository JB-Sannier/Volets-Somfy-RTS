import "reflect-metadata";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  request,
  response,
  interfaces,
} from "inversify-express-utils";
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
import { IUser } from "../models/models";
import { checkToken } from "../middlewares/check-token-middleware";
import { UnauthorizedError } from "../models/app-error";
import {
  IRefreshTokenService,
  refreshTokenServiceKey,
} from "../services/refresh-token-sevice";

@controller("/api/v1/auth")
export class AuthenticationController extends BaseHttpController {
  constructor(
    @inject(appConfigServiceKey) private readonly appConfig: IAppConfigService,
    @inject(userServiceKey) private readonly userService: IUserService,
    @inject(refreshTokenServiceKey)
    private readonly refreshTokenService: IRefreshTokenService,
  ) {
    super();
  }

  @httpPost("/token")
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

  @httpGet("/config")
  @checkToken()
  async getConfig(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const user = this.httpContext.user as interfaces.Principal<IUser>;

    const response = {
      dbHostname: this.appConfig.dbHostName(),
      dbPort: this.appConfig.dbPort(),
      dbUserName: this.appConfig.dbUserName(),
      dbSchema: this.appConfig.dbSchema(),
      user: {
        email: user.details.email,
        roles: user.details.roles,
      },
    };
    res.status(200).json(response);
  }

  @httpGet("/tokenInfos")
  @checkToken()
  async getUserInfos(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const user = this.httpContext.user as interfaces.Principal<
      IUser | undefined
    >;
    if (!user.details) {
      throw new UnauthorizedError();
    }
    res.status(200).json({
      email: user.details.email,
      roles: user.details.roles,
    });
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
    const response =
      await this.refreshTokenService.refreshToken(refreshTokenRequest);

    res.status(200).json(response);
  }
}
