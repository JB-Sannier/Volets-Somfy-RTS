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
} from "../models/lights-requests";
import {
	addLightValidator,
	getLightValidator,
	modifyLightValidator,
	deleteLightValidator,
	importLightsValidator,
} from "../models/lights-validators";

import { checkToken } from "../middlewares/check-token-middleware";
import {
	lightsProxyServiceKey,
	ILightsProxyService,
} from "../services/lights-proxy-service";
import { checkUserRole } from "../middlewares/check-user-roles-middleware";
import { UserRole } from "../models/models";

@Controller("/api/v1/lights")
@checkToken()
export class LightsManagementController {
	constructor(
		@inject(lightsProxyServiceKey)
		private readonly lightsService: ILightsProxyService,
	) {}

	@Get("/")
	async listLights(
		@request() _req: Request,
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
	@checkUserRole(UserRole.LightsProgrammer)
	async addLight(
		@request() req: Request,
		@response() res: Response,
	): Promise<void> {
		console.log("Adding light with payload:", req.body);
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
		console.log("Validated payload:", payload);
		const response = await this.lightsService.addLight(payload);
		res.status(201).json(response);
	}

	@Post("/export")
	@checkUserRole(UserRole.LightsProgrammer)
	async exportLights(
		@request() _req: Request,
		@response() res: Response,
	): Promise<void> {
		const response = await this.lightsService.getAllLights();
		res.status(200).json(response);
	}

	@Post("/import")
	@checkUserRole(UserRole.LightsProgrammer)
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
	@checkUserRole(UserRole.LightsProgrammer)
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
	@checkUserRole(UserRole.LightsProgrammer)
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
