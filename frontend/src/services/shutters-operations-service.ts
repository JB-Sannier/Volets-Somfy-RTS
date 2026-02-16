import { processRequest, type IHttpEndpoint } from "./base-api-calls";
import { type IStopShutterResponse } from "./shutters-operations-service.types";
import type {
  ILowerShutterRequest,
  ILowerShutterResponse,
  IProgramShutterRequest,
  IProgramShutterResponse,
  IRaiseShutterRequest,
  IRaiseShutterResponse,
  IStopShutterRequest,
} from "./shutters-operations-service.types";

declare const BACKEND_URL: string;

const BASE_PATH = `${BACKEND_URL}/api/v1/operateShutter`;

const RAISE_SHUTTER: IHttpEndpoint = {
  url: `${BASE_PATH}/raise`,
  method: 'post',
  needsAuth: true,
}
const LOWER_SHUTTER: IHttpEndpoint = {
  url: `${BASE_PATH}/lower`,
  method: 'post',
  needsAuth: true,
}
const STOP_SHUTTER: IHttpEndpoint = {
  url: `${BASE_PATH}/stop`,
  method: 'post',
  needsAuth: true,
}
const PROGRAM_SHUTTER: IHttpEndpoint = {
  url: `${BASE_PATH}/program`,
  method: 'post',
  needsAuth: true,
}

export const useShuttersOperationApis = () => {
  async function raiseShutter(
    request: IRaiseShutterRequest,
  ): Promise<IRaiseShutterResponse> {
    try {
      const response = await processRequest<IRaiseShutterRequest, IRaiseShutterResponse>(RAISE_SHUTTER, request);
      return response;
    } catch (error: unknown) {
      console.error(`RaiseShutter: ${request.shutterId}: Error: `, error);
      throw error;
    }
  }

  async function lowerShutter(
    request: ILowerShutterRequest,
  ): Promise<ILowerShutterResponse> {
    try {
      const response = await processRequest<ILowerShutterRequest, ILowerShutterResponse>(LOWER_SHUTTER, request);
      return response;
    } catch (error: unknown) {
      console.error(`LowerShutter: ${request.shutterId}: Error: `, error);
      throw error;
    }
  }

  async function stopShutter(
    request: IStopShutterRequest,
  ): Promise<IStopShutterResponse> {
    try {
      const response = await processRequest<IStopShutterRequest, IStopShutterResponse>(STOP_SHUTTER, request);
      return response;
    } catch (error: unknown) {
      console.error(`StopShutter: ${request.shutterId}: Error: `, error);
      throw error;
    }
  }

  async function programShutter(
    request: IProgramShutterRequest,
  ): Promise<IProgramShutterResponse> {
    try {
      const response = await processRequest<IProgramShutterRequest, IProgramShutterResponse>(PROGRAM_SHUTTER, request);
      return response;
    } catch (error: unknown) {
      console.error(`ProgramShutter: ${request.shutterId}: Error: `, error);
      throw error;
    }
  }

  return { raiseShutter, lowerShutter, stopShutter, programShutter };
};
