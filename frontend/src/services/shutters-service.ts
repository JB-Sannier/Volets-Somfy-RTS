import type {
  IAddShutterRequest,
  IAddShutterResponse,
  IDeleteShutterRequest,
  IDeleteShutterResponse,
  IGetShutterRequest,
  IGetShutterResponse,
  IListShuttersResponse,
  IModifyShutterRequest,
  IModifyShutterResponse,
} from "./shutters-service.types";
import { processRequest, type IHttpEndpoint } from "./base-api-calls";

declare const BACKEND_URL: string;

const BASE_PATH = `${BACKEND_URL}/api/v1/shutter`;

export const useShuttersManagementApis = () => {
  async function listShutters(): Promise<IListShuttersResponse> {
    const listShutters: IHttpEndpoint = {
      url: BASE_PATH,
      method: 'get',
      needsAuth: true,
    }
    try {
      const response = await processRequest<void, IListShuttersResponse>(listShutters);
      return response;
    } catch (error: unknown) {
      console.error("ListShutters: Error: ", error);
      throw error;
    }
  }

  async function getShutter(
    request: IGetShutterRequest,
  ): Promise<IGetShutterResponse> {
    const getShutterEndpoint: IHttpEndpoint = {
      url: `${BASE_PATH}/${encodeURIComponent(request.shutterId)}`,
      method: 'get',
      needsAuth: true,
    }
    try {
      const response = await processRequest<IGetShutterRequest, IGetShutterResponse>(getShutterEndpoint, undefined, `/${encodeURIComponent(request.shutterId)}`);
      return response;
    } catch (error) {
      console.error(`GetShutter: ${request.shutterId} : error : `, error);
      throw error;
    }
  }

  async function addShutter(
    request: IAddShutterRequest,
  ): Promise<IAddShutterResponse> {
    try {
      const addShutter: IHttpEndpoint = {
        url: BASE_PATH,
        method: 'post',
        needsAuth: true,
      }
      const response = await processRequest<IAddShutterRequest, IAddShutterResponse>(addShutter, request);
      return response;
    } catch (error: unknown) {
      console.error(`AddShutter: ${request.shutterName}: error: `, error);
      throw error;
    }
  }

  async function modifyShutter(
    request: IModifyShutterRequest,
  ): Promise<IModifyShutterResponse> {
    try {
      const modifyShutterEndpoint: IHttpEndpoint = {
        url: BASE_PATH,
        method: 'put',
        needsAuth: true,
      }
      const response = await processRequest<IModifyShutterRequest, IModifyShutterResponse>(modifyShutterEndpoint, request);
      return response;
    } catch (error: unknown) {
      console.error(
        `ModifyShutter: ${request.shutterId} - ${request.shutterName}: Error: `,
        error,
      );
      throw error;
    }
  }

  async function deleteShutter(
    request: IDeleteShutterRequest,
  ): Promise<IDeleteShutterResponse> {
    const deleteShutterEndpoint: IHttpEndpoint = {
      url: `${BASE_PATH}/${encodeURIComponent(request.shutterId)}`,
      method: 'delete',
      needsAuth: true,
    }
    try {
      const response = await processRequest<void, IDeleteShutterResponse>(deleteShutterEndpoint);
      return response;
    } catch (error: unknown) {
      console.error(`DeleteShutter: ${request.shutterId}: Error: `, error);
      throw error;
    }
  }

  return { listShutters, getShutter, addShutter, modifyShutter, deleteShutter };
};
