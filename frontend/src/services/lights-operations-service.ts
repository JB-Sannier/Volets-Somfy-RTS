import { processRequest, type IHttpEndpoint } from "./base-api-calls";
import type { ISwitchLightRequest } from "./lights-operations-service.types";

declare const BACKEND_URL: string;

const BASE_PATH = `${BACKEND_URL}/api/v1/lightsOperations`;

const SWITCH_ON_LIGHT: IHttpEndpoint = {
	url: `${BASE_PATH}/switchOn`,
	method: "post",
	needsAuth: true,
};

const SWITCH_OFF_LIGHT: IHttpEndpoint = {
	url: `${BASE_PATH}/switchOff`,
	method: "post",
	needsAuth: true,
};

const SWITCH_LIGHT: IHttpEndpoint = {
	url: `${BASE_PATH}/switch`,
	method: "post",
	needsAuth: true,
};

export const useLightsOperationApis = () => {
	async function switchOnLight(request: ISwitchLightRequest): Promise<void> {
		try {
			await processRequest<ISwitchLightRequest, void>(SWITCH_ON_LIGHT, request);
		} catch (error: unknown) {
			console.error(`SwitchOnLight: ${request.lightId}: Error: `, error);
			throw error;
		}
	}

	async function switchOffLight(request: ISwitchLightRequest): Promise<void> {
		try {
			await processRequest<ISwitchLightRequest, void>(
				SWITCH_OFF_LIGHT,
				request,
			);
		} catch (error: unknown) {
			console.error(`SwitchOffLight: ${request.lightId}: Error: `, error);
			throw error;
		}
	}

	async function switchLight(request: ISwitchLightRequest): Promise<void> {
		try {
			await processRequest<ISwitchLightRequest, void>(SWITCH_LIGHT, request);
		} catch (error: unknown) {
			console.error(`SwitchLight: ${request.lightId}: Error: `, error);
			throw error;
		}
	}

	return { switchOnLight, switchOffLight, switchLight };
};
