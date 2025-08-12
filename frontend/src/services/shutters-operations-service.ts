import { type IStopShutterResponse } from "./shutters-operations-service.types";
import axios from "axios";
import type {
  ILowerShutterRequest,
  ILowerShutterResponse,
  IProgramShutterRequest,
  IProgramShutterResponse,
  IRaiseShutterRequest,
  IRaiseShutterResponse,
  IStopShutterRequest,
} from "./shutters-operations-service.types";

const BASE_PATH = "/api/v1/operateShutter";

export async function raiseShutter(
  request: IRaiseShutterRequest,
): Promise<IRaiseShutterResponse> {
  const url = `${BASE_PATH}/raise`;
  try {
    const response = await axios.post(url, request);
    return response.data;
  } catch (error: unknown) {
    console.error(`RaiseShutter: ${request.shutterId}: Error: `, error);
    throw error;
  }
}

export async function lowerShutter(
  request: ILowerShutterRequest,
): Promise<ILowerShutterResponse> {
  const url = `${BASE_PATH}/lower`;
  try {
    const response = await axios.post(url, request);
    return response.data;
  } catch (error: unknown) {
    console.error(`LowerShutter: ${request.shutterId}: Error: `, error);
    throw error;
  }
}
export async function stopShutter(
  request: IStopShutterRequest,
): Promise<IStopShutterResponse> {
  const url = `${BASE_PATH}/stop`;
  try {
    const response = await axios.post(url, request);
    return response.data;
  } catch (error: unknown) {
    console.error(`StopShutter: ${request.shutterId}: Error: `, error);
    throw error;
  }
}
export async function programShutter(
  request: IProgramShutterRequest,
): Promise<IProgramShutterResponse> {
  const url = `${BASE_PATH}/program`;
  try {
    const response = await axios.post(url, request);
    return response.data;
  } catch (error: unknown) {
    console.error(`ProgramShutter: ${request.shutterId}: Error: `, error);
    throw error;
  }
}
