import "reflect-metadata";
import { inject } from "inversify";
import {
  Controller,
  Post,
  Request as request,
  Response as response,
} from "@inversifyjs/http-core";
import type { Request, Response } from "express";
import {
  appConfigServiceKey,
  type IAppConfigService,
} from "../services/app-config-service";
import { checkApiKey } from "../middlewares/check-api-key-middleware";

import type { ISwitchLightRequest } from "../requests/requests";
import { switchLightValidator } from "../validators/validators";

import {
  type ILightsService,
  lightsServiceKey,
} from "../services/lights-service";

@Controller("/api/v1/operateLights")
@checkApiKey()
export class LightsOperateController {
  constructor(
    @inject(appConfigServiceKey) readonly _appConfig: IAppConfigService,
    @inject(lightsServiceKey) private readonly lightsService: ILightsService,
  ) {}

  @Post("/on")
  async switchLightOn(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const baseRequest: ISwitchLightRequest = {
      lightId: req.body.lightId,
    };
    const raiseRequest = await switchLightValidator.validate(baseRequest);
    const response = await this.lightsService.switchOn(raiseRequest);
    res.status(200).json(response);
  }

  @Post("/off")
  async switchLightOff(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const baseRequest: ISwitchLightRequest = {
      lightId: req.body.lightId,
    };
    const lowerRequest = await switchLightValidator.validate(baseRequest);
    const response = await this.lightsService.switchOff(lowerRequest);
    res.status(200).json(response);
  }

  @Post("/switch")
  async switchLight(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const baseRequest: ISwitchLightRequest = {
      lightId: req.body.lightId,
    };
    const switchRequest = await switchLightValidator.validate(baseRequest);
    const response = await this.lightsService.switchOn(switchRequest);
    res.status(200).json(response);
  }
}
