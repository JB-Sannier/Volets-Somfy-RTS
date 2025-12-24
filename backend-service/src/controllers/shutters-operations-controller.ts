import "reflect-metadata";
import { inject } from "inversify";
import {
  Controller,
  Post,
  Request as request,
  Response as response,
} from "@inversifyjs/http-core";

import { Request, Response } from "express";
import {
  IShuttersProxyService,
  shuttersProxyServiceKey,
} from "../services/shutters-proxy-service";
import {
  ILowerShutterRequest,
  IProgramShutterRequest,
  IRaiseShutterRequest,
  IStopShutterRequest,
} from "../models/shutters-requests";
import {
  lowerShutterValidator,
  programShutterValidator,
  raiseShutterValidator,
  stopShutterValidator,
} from "../models/shutters-validators";
import { checkToken } from "../middlewares/check-token-middleware";

@Controller("/api/v1/operateShutter")
@checkToken()
export class ShuttersOperationsController {
  constructor(
    @inject(shuttersProxyServiceKey)
    private readonly shutterService: IShuttersProxyService,
  ) {}

  @Post("/raise")
  async raiseShutter(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const baseRequest: IRaiseShutterRequest = {
      shutterId: req.body?.shutterId,
    };
    const raiseRequest = await raiseShutterValidator.validate(baseRequest);
    const response = await this.shutterService.raiseShutter(raiseRequest);
    res.status(200).json(response);
  }

  @Post("/lower")
  async lowerShutter(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const baseRequest: ILowerShutterRequest = {
      shutterId: req.body?.shutterId,
    };
    const lowerRequest = await lowerShutterValidator.validate(baseRequest);
    const response = await this.shutterService.lowerShutter(lowerRequest);
    res.status(200).json(response);
  }

  @Post("/stop")
  async stopShutter(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const baseRequest: IStopShutterRequest = {
      shutterId: req.body?.shutterId,
    };
    const stopRequest = await stopShutterValidator.validate(baseRequest);
    const response = await this.shutterService.stopShutter(stopRequest);
    res.status(200).json(response);
  }

  @Post("/program")
  async programShutter(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const baseRequest: IProgramShutterRequest = {
      shutterId: req.body?.shutterId,
    };
    const programRequest = await programShutterValidator.validate(baseRequest);
    const response = await this.shutterService.programShutter(programRequest);
    res.status(200).json(response);
  }
}
