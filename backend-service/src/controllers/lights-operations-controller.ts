import "reflect-metadata";
import { inject } from "inversify";
import {
	Controller,
	Post,
	Request as request,
	Response as response,
} from "@inversifyjs/http-core";
import type { Request, Response } from "express";

import { OK_RESPONSE } from "../models/lights-requests";
import { switchLightValidator } from "../models/lights-validators";

import {
	ILightsProxyService,
	lightsProxyServiceKey,
} from "../services/lights-proxy-service";
import { checkToken } from "../middlewares/check-token-middleware";
import { checkUserRole } from "../middlewares/check-user-roles-middleware";
import { UserRole } from "../models/models";

@Controller("/api/v1/lightsOperations")
@checkToken()
export class LightsOperationsController {
	constructor(
		@inject(lightsProxyServiceKey)
		private readonly lightsService: ILightsProxyService,
	) {}

	@Post("/switchOn")
	@checkUserRole(UserRole.LightsUser)
	async switchOnLight(
		@request() req: Request,
		@response() res: Response,
	): Promise<void> {
		const requestPayload = {
			lightId: req.body.lightId as string,
		};
		const validatedPayload =
			await switchLightValidator.validate(requestPayload);
		await this.lightsService.switchOn(validatedPayload);
		res.status(200).json(OK_RESPONSE);
	}

	@Post("/switchOff")
	@checkUserRole(UserRole.LightsUser)
	async switchOffLight(
		@request() req: Request,
		@response() res: Response,
	): Promise<void> {
		const requestPayload = {
			lightId: req.body.lightId as string,
		};
		const validatedPayload =
			await switchLightValidator.validate(requestPayload);
		await this.lightsService.switchOff(validatedPayload);
		res.status(200).json(OK_RESPONSE);
	}

	@Post("/switch")
	@checkUserRole(UserRole.LightsUser)
	async switchLight(
		@request() req: Request,
		@response() res: Response,
	): Promise<void> {
		const requestPayload = {
			lightId: req.body.lightId as string,
		};
		const validatedPayload =
			await switchLightValidator.validate(requestPayload);
		await this.lightsService.switch(validatedPayload);
		res.status(200).json(OK_RESPONSE);
	}
}
