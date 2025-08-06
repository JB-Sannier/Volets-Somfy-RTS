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
  httpGet,
} from "inversify-express-utils";
import { Request, Response } from "express";
import {
  IAddShutterRequest,
  IDeleteShutterRequest,
  IGetShutterRequest,
  IModifyShutterRequest,
} from "../requests/requests";
import {
  addShutterValidator,
  deleteShutterValidator,
  getShutterValidator,
  modifyShutterValidator,
} from "../requests/validators";
import {
  shutterServiceKey,
  IShutterService,
} from "../services/shutters-service";
import { checkApiKey } from "../middlewares/check-api-key-middleware";

@controller("/api/v1/shutter")
@checkApiKey()
export class SomfyShuttersController extends BaseHttpController {
  constructor(
    @inject(shutterServiceKey) private readonly shutterService: IShutterService,
  ) {
    super();
  }

  @httpGet("/")
  async listShutters(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const shutters = await this.shutterService.listShutters();
    res.status(200).json(shutters);
  }

  @httpGet("/:shutterId")
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

  @httpPost("/")
  async addShutter(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const basePayload: IAddShutterRequest = {
      shutterName: req.body.shutterName,
    };
    const payload = await addShutterValidator.validate(basePayload);
    const response = await this.shutterService.addShutter(payload);
    res.status(201).json(response);
  }

  @httpPut("/")
  async modifyUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const basePayload: IModifyShutterRequest = {
      shutterId: req.body.shutterId,
      shutterName: req.body.shutterName,
    };
    const payload = await modifyShutterValidator.validate(basePayload);
    const response = await this.shutterService.modifyShutter(payload);
    res.status(200).json(response);
  }

  @httpDelete("/:shutterId")
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
