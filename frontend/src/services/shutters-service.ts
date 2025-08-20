import axios from "axios";
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

const BASE_PATH = "/api/v1/shutter";

export const useShuttersManagementApis = () => {
  async function listShutters(): Promise<IListShuttersResponse> {
    try {
      const response = await axios.get<IListShuttersResponse>(BASE_PATH);
      return response.data;
    } catch (error: unknown) {
      console.error("ListShutters: Error: ", error);
      throw error;
    }
  }

  async function getShutter(
    request: IGetShutterRequest,
  ): Promise<IGetShutterResponse> {
    const url = `${BASE_PATH}/${encodeURIComponent(request.shutterId)}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`GetShutter: ${request.shutterId} : error : `, error);
      throw error;
    }
  }

  async function addShutter(
    request: IAddShutterRequest,
  ): Promise<IAddShutterResponse> {
    try {
      const response = await axios.post(BASE_PATH, request);
      return response.data;
    } catch (error: unknown) {
      console.error(`AddShutter: ${request.shutterName}: error: `, error);
      throw error;
    }
  }

  async function modifyShutter(
    request: IModifyShutterRequest,
  ): Promise<IModifyShutterResponse> {
    try {
      const response = await axios.put(BASE_PATH, request);
      return response.data;
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
    const url = `${BASE_PATH}/${encodeURIComponent(request.shutterId)}`;
    try {
      const response = await axios.delete<IDeleteShutterResponse>(url);
      return response.data;
    } catch (error: unknown) {
      console.error(`DeleteShutter: ${request.shutterId}: Error: `, error);
      throw error;
    }
  }

  return { listShutters, getShutter, addShutter, modifyShutter, deleteShutter };
};
