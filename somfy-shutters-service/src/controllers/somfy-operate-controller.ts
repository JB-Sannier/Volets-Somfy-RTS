import "reflect-metadata";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpPost,
  request,
  response,
} from "inversify-express-utils";
import { Request, Response } from "express";
import {
  appConfigServiceKey,
  IAppConfigService,
} from "../services/app-config-service";
import { checkApiKey } from "../middlewares/check-api-key-middleware";
import {
  IShutterService,
  shutterServiceKey,
} from "../services/shutters-service";
import {
  IShutterProxyService,
  shutterProxyServiceKey,
} from "../services/shutters-proxy-service";
import {
  ILowerShutterRequest,
  IProgramShutterRequest,
  IRaiseShutterRequest,
  IStopShutterRequest,
} from "../requests/requests";
import {
  lowerShutterValidator,
  programShutterValidator,
  raiseShutterValidator,
  stopShutterValidator,
} from "../requests/validators";

@controller("/api/v1/operateShutter")
@checkApiKey()
export class SomfyProxyController extends BaseHttpController {
  constructor(
    @inject(appConfigServiceKey) private readonly appConfig: IAppConfigService,
    @inject(shutterServiceKey) private readonly shutterService: IShutterService,
    @inject(shutterProxyServiceKey)
    private readonly shutterProxyService: IShutterProxyService,
  ) {
    super();
  }

  @httpPost("/raise")
  async raiseShutter(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const baseRequest: IRaiseShutterRequest = {
      shutterId: req.body.shutterId,
    };
    const raiseRequest = await raiseShutterValidator.validate(baseRequest);
    const response = await this.shutterService.raiseShutter(raiseRequest);
    res.status(200).json(response);
  }

  @httpPost("/lower")
  async lowerShutter(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const baseRequest: ILowerShutterRequest = {
      shutterId: req.body.shutterId,
    };
    const lowerRequest = await lowerShutterValidator.validate(baseRequest);
    const response = await this.shutterService.lowerShutter(lowerRequest);
    res.status(200).json(response);
  }

  @httpPost("/stop")
  async stopShutter(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const baseRequest: IStopShutterRequest = {
      shutterId: req.body.shutterId,
    };
    const stopRequest = await stopShutterValidator.validate(baseRequest);
    const response = await this.shutterService.stopShutter(stopRequest);
    res.status(200).json(response);
  }

  @httpPost("/program")
  async programShutter(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const baseRequest: IProgramShutterRequest = {
      shutterId: req.body.shutterId,
    };
    const programRequest = await programShutterValidator.validate(baseRequest);
    const response = await this.shutterService.programShutter(programRequest);
    res.status(200).json(response);
  }
}
