import "reflect-metadata";
import { inject } from "inversify";
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Request as request,
  Response as response,
} from "@inversifyjs/http-core";
import type { Request, Response } from "express";

import {
  OK_RESPONSE,
  type IAddLightRequest,
  type IDeleteLightRequest,
  type IGetLightRequest,
  type IImportLightsRequest,
  type IUpdateLightRequest,
} from "../requests/requests";
import {
  addLightValidator,
  getLightValidator,
  modifyLightValidator,
  deleteLightValidator,
  importLightsValidator,
} from "../validators/validators";

import { checkApiKey } from "../middlewares/check-api-key-middleware";
import { lightsServiceKey, ILightsService } from "../services/lights-service";

@Controller("/api/v1/lights-management")
@checkApiKey()
export class LightsManagementController {
  constructor(
    @inject(lightsServiceKey) private readonly lightsService: ILightsService,
  ) {}

  @Get("/")
  async listLights(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const lights = await this.lightsService.getAllLights();
    res.status(200).json(lights);
  }

  @Get("/:lightId")
  async getLight(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const requestPayload: IGetLightRequest = {
      lightId: req.params.lightId as string,
    };
    const getLightRequest = await getLightValidator.validate(requestPayload);
    const light = await this.lightsService.getLight(getLightRequest);
    res.status(200).json(light);
  }

  @Post("/")
  async addLight(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const basePayload: IAddLightRequest = {
      lightName: req.body.lightName,
      description: req.body.description,
      type: req.body.type,
      switchOnCode: req.body.switchOnCode,
      switchOffCode: req.body.switchOffCode,
      pulseLength: req.body.pulseLength,
      protocol: req.body.protocol,
      frequency: req.body.frequency,
    };
    const payload = await addLightValidator.validate(basePayload);
    const response = await this.lightsService.addLight(payload);
    res.status(201).json(response);
  }

  @Post("/export")
  async exportLights(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const response = await this.lightsService.getAllLights();
    res.status(200).json(response);
  }

  @Post("/import")
  async importLights(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const request: IImportLightsRequest = {
      lights: req.body.lights,
    };
    await importLightsValidator.validate(request);
    await this.lightsService.importLights(request);
    res.status(200).json(OK_RESPONSE);
  }

  @Put("/")
  async modifyLight(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const basePayload: IUpdateLightRequest = {
      lightId: req.body.lightId,
      lightName: req.body.lightName,
      description: req.body.description,
      type: req.body.type,
      switchOnCode: req.body.switchOnCode,
      switchOffCode: req.body.switchOffCode,
      pulseLength: req.body.pulseLength,
      protocol: req.body.protocol,
      frequency: req.body.frequency,
    };
    const payload = await modifyLightValidator.validate(basePayload);
    await this.lightsService.updateLight(payload);
    res.status(200).json(OK_RESPONSE);
  }

  @Delete("/:lightId")
  async deleteLight(
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const basePayload: IDeleteLightRequest = {
      lightId: req.params.lightId as string,
    };
    const payload = await deleteLightValidator.validate(basePayload);
    await this.lightsService.deleteLight(payload);
    res.status(200).json(OK_RESPONSE);
  }
}
