import { processRequest, type IHttpEndpoint } from "./base-api-calls";
import type {
	IAddLightRequest,
	IDeleteLightRequest,
	IGetLightRequest,
	ILight,
} from "./lights-management-service.types";

declare const BACKEND_URL: string;

const BASE_PATH = `${BACKEND_URL}/api/v1/lights`;

const LIST_LIGHTS: IHttpEndpoint = {
	url: `${BASE_PATH}/`,
	method: "get",
	needsAuth: true,
};

const GET_LIGHT: IHttpEndpoint = {
	url: `${BASE_PATH}/{LIGHT_ID}`,
	method: "get",
	needsAuth: true,
};

const ADD_LIGHT: IHttpEndpoint = {
	url: `${BASE_PATH}/`,
	method: "post",
	needsAuth: true,
};

const UPDATE_LIGHT: IHttpEndpoint = {
	url: `${BASE_PATH}/`,
	method: "put",
	needsAuth: true,
};

const DELETE_LIGHT: IHttpEndpoint = {
	url: `${BASE_PATH}/{LIGHT_ID}`,
	method: "delete",
	needsAuth: true,
};

export const useLightsManagementApis = () => {
	async function listLights(): Promise<ILight[]> {
		try {
			const result = await processRequest<void, ILight[]>(
				LIST_LIGHTS,
				undefined,
			);
			return result;
		} catch (error: unknown) {
			console.error(`ListLights: Error: `, error);
			throw error;
		}
	}

	async function getLight(request: IGetLightRequest): Promise<ILight> {
		try {
			const finalEndpoint: IHttpEndpoint = {
				url: GET_LIGHT.url.replace("{LIGHT_ID}", request.lightId),
				method: GET_LIGHT.method,
				needsAuth: GET_LIGHT.needsAuth,
			};
			const result = await processRequest<IGetLightRequest, ILight>(
				finalEndpoint,
				request,
			);
			return result;
		} catch (error: unknown) {
			console.error(`GetLight: ${request.lightId}: Error: `, error);
			throw error;
		}
	}

	async function addLight(request: IAddLightRequest): Promise<ILight> {
		console.log("addLight: request : ", request);
		try {
			const result = await processRequest<IAddLightRequest, ILight>(
				ADD_LIGHT,
				request,
			);
			console.log("addLight: result : ", result);
			return result;
		} catch (error: unknown) {
			console.error(`AddLight: ${request.lightName}: Error: `, error);
			throw error;
		}
	}

	async function updateLight(request: IAddLightRequest): Promise<ILight> {
		console.log("updateLight: request : ", request);
		try {
			const result = await processRequest<IAddLightRequest, ILight>(
				UPDATE_LIGHT,
				request,
			);
			console.log("updateLight: result : ", result);
			return result;
		} catch (error: unknown) {
			console.error(`UpdateLight: ${request.lightName}: Error: `, error);
			throw error;
		}
	}

	async function deleteLight(request: IDeleteLightRequest): Promise<void> {
		try {
			const finalEndpoint: IHttpEndpoint = {
				url: DELETE_LIGHT.url.replace("{LIGHT_ID}", request.lightId),
				method: DELETE_LIGHT.method,
				needsAuth: DELETE_LIGHT.needsAuth,
			};
			await processRequest<IDeleteLightRequest, void>(finalEndpoint, request);
		} catch (error: unknown) {
			console.error(`DeleteLight: ${request.lightId}: Error: `, error);
			throw error;
		}
	}

	return { listLights, getLight, addLight, updateLight, deleteLight };
};
