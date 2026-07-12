import { inject } from "inversify";
import { provide } from "@inversifyjs/binding-decorators";

import { appConfigServiceKey, IAppConfigService } from "./app-config-service";
import {} from "../models/app-error";
import {
	IAddLightRequest,
	IDeleteLightRequest,
	IGetLightRequest,
	IImportLightsRequest,
	ILight,
	ISwitchLightRequest,
	IUpdateLightRequest,
} from "../models/lights-requests";

export const lightsProxyServiceKey = Symbol.for("LightsProxyService");

export interface ILightsProxyService {
	getAllLights(): Promise<ILight[]>;
	getLight(request: IGetLightRequest): Promise<ILight>;
	addLight(request: IAddLightRequest): Promise<ILight>;
	updateLight(request: IUpdateLightRequest): Promise<void>;
	deleteLight(request: IDeleteLightRequest): Promise<void>;
	importLights(request: IImportLightsRequest): Promise<void>;
	switchOn(request: ISwitchLightRequest): Promise<void>;
	switchOff(request: ISwitchLightRequest): Promise<void>;
	switch(request: ISwitchLightRequest): Promise<void>;
}

@provide(lightsProxyServiceKey)
export class LightsProxyService implements ILightsProxyService {
	constructor(
		@inject(appConfigServiceKey)
		private readonly appConfigService: IAppConfigService,
	) {}

	async getAllLights(): Promise<ILight[]> {
		const lightsServiceURL = this.appConfigService.lightsServiceURL();
		const lightsServiceApiKey = this.appConfigService.lightsServiceApiKey();

		const response = await fetch(
			`${lightsServiceURL}/api/v1/lights-management`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": lightsServiceApiKey,
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch lights: ${response.statusText}`);
		}

		const jsonResponse = await response.json();
		return jsonResponse as ILight[];
	}

	async getLight(request: IGetLightRequest): Promise<ILight> {
		const lightsServiceURL = this.appConfigService.lightsServiceURL();
		const lightsServiceApiKey = this.appConfigService.lightsServiceApiKey();

		const response = await fetch(
			`${lightsServiceURL}/api/v1/lights-management/${request.lightId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": lightsServiceApiKey,
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch light: ${response.statusText}`);
		}

		const jsonResponse = await response.json();
		return jsonResponse as ILight;
	}

	async addLight(request: IAddLightRequest): Promise<ILight> {
		const lightsServiceURL = this.appConfigService.lightsServiceURL();
		const lightsServiceApiKey = this.appConfigService.lightsServiceApiKey();

		console.log("LightsServiceApiKey : ", lightsServiceApiKey);
		const url = `${lightsServiceURL}/api/v1/lights-management/`;

		console.log("About to call proxy service with : ", { url, request });

		const response = await fetch(
			`${lightsServiceURL}/api/v1/lights-management/`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": lightsServiceApiKey,
				},
				body: JSON.stringify(request),
			},
		);
		console.log("response : ", response);

		if (!response.ok) {
			throw new Error(`Failed to add light: ${response.statusText}`);
		}

		const jsonResponse = await response.json();
		return jsonResponse as ILight;
	}

	async updateLight(request: IUpdateLightRequest): Promise<void> {
		const lightsServiceURL = this.appConfigService.lightsServiceURL();
		const lightsServiceApiKey = this.appConfigService.lightsServiceApiKey();

		const response = await fetch(
			` ${lightsServiceURL}/api/v1/lights-management/`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": lightsServiceApiKey,
				},
				body: JSON.stringify(request),
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to update light: ${response.statusText}`);
		}
	}

	async deleteLight(request: IDeleteLightRequest): Promise<void> {
		const lightsServiceURL = this.appConfigService.lightsServiceURL();
		const lightsServiceApiKey = this.appConfigService.lightsServiceApiKey();

		const response = await fetch(
			`${lightsServiceURL}/api/v1/lights-management/${request.lightId}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": lightsServiceApiKey,
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to delete light: ${response.statusText}`);
		}
	}

	async importLights(request: IImportLightsRequest): Promise<void> {
		const lightsServiceURL = this.appConfigService.lightsServiceURL();
		const lightsServiceApiKey = this.appConfigService.lightsServiceApiKey();

		const response = await fetch(
			`${lightsServiceURL}/api/v1/lights-management/import`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": lightsServiceApiKey,
				},
				body: JSON.stringify(request),
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to import lights: ${response.statusText}`);
		}
	}

	async switchOn(request: ISwitchLightRequest): Promise<void> {
		const lightsServiceURL = this.appConfigService.lightsServiceURL();
		const lightsServiceApiKey = this.appConfigService.lightsServiceApiKey();

		const response = await fetch(
			`${lightsServiceURL}/api/v1/operateLights/on`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": lightsServiceApiKey,
				},
				body: JSON.stringify(request),
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to switch light on: ${response.statusText}`);
		}
	}

	async switchOff(request: ISwitchLightRequest): Promise<void> {
		const lightsServiceURL = this.appConfigService.lightsServiceURL();
		const lightsServiceApiKey = this.appConfigService.lightsServiceApiKey();

		const response = await fetch(
			`${lightsServiceURL}/api/v1/operateLights/off`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": lightsServiceApiKey,
				},
				body: JSON.stringify(request),
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to switch light off: ${response.statusText}`);
		}
	}

	async switch(request: ISwitchLightRequest): Promise<void> {
		const lightsServiceURL = this.appConfigService.lightsServiceURL();
		const lightsServiceApiKey = this.appConfigService.lightsServiceApiKey();

		const response = await fetch(
			`${lightsServiceURL}/api/v1/operateLights/switch`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": lightsServiceApiKey,
				},
				body: JSON.stringify(request),
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to switch light : ${response.statusText}`);
		}
	}
}
