import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import {
  IAddShutterRequest,
  IAddShutterResponse,
  IDeleteShutterRequest,
  IDeleteShutterResponse,
  IGetShutterRequest,
  IGetShutterResponse,
  IListShuttersResponse,
  ILowerShutterRequest,
  ILowerShutterResponse,
  IModifyShutterRequest,
  IModifyShutterResponse,
  IProgramShutterRequest,
  IProgramShutterResponse,
  IRaiseShutterRequest,
  IRaiseShutterResponse,
  IStopShutterRequest,
  IStopShutterResponse,
} from "../models/shutters-requests";
import { appConfigServiceKey, IAppConfigService } from "./app-config-service";
import { AppError, UnauthorizedError } from "../models/app-error";
import axios, { AxiosRequestConfig, isAxiosError } from "axios";

export const shuttersProxyServiceKey = Symbol.for("ShuttersProxyService");

export interface IShuttersProxyService {
  addShutter(request: IAddShutterRequest): Promise<IAddShutterResponse>;
  getShutter(request: IGetShutterRequest): Promise<IGetShutterResponse>;
  modifyShutter(
    request: IModifyShutterRequest,
  ): Promise<IModifyShutterResponse>;
  deleteShutter(
    request: IDeleteShutterRequest,
  ): Promise<IDeleteShutterResponse>;
  listShutters(): Promise<IListShuttersResponse>;

  raiseShutter(request: IRaiseShutterRequest): Promise<IRaiseShutterResponse>;
  lowerShutter(request: ILowerShutterRequest): Promise<ILowerShutterResponse>;
  stopShutter(request: IStopShutterRequest): Promise<IStopShutterResponse>;
  programShutter(
    request: IProgramShutterRequest,
  ): Promise<IProgramShutterResponse>;
}

@provide(shuttersProxyServiceKey)
export class ShuttersProxyService implements IShuttersProxyService {
  constructor(
    @inject(appConfigServiceKey) private readonly appConfig: IAppConfigService,
  ) {}

  async addShutter(request: IAddShutterRequest): Promise<IAddShutterResponse> {
    const baseUrl = this.appConfig.somfyShuttersServiceURL();
    const fullPath = `${baseUrl}/api/v1/shutter`;
    try {
      const response = await axios.post<IAddShutterResponse>(
        fullPath,
        request,
        this.prepareAxiosConfig(),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  async getShutter(request: IGetShutterRequest): Promise<IGetShutterResponse> {
    const baseUrl = this.appConfig.somfyShuttersServiceURL();
    const fullPath = `${baseUrl}/api/v1/shutter/${request.shutterId}`;
    try {
      const response = await axios.get<IGetShutterResponse>(
        fullPath,
        this.prepareAxiosConfig(),
      );
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  async modifyShutter(
    request: IModifyShutterRequest,
  ): Promise<IModifyShutterResponse> {
    const baseUrl = this.appConfig.somfyShuttersServiceURL();
    const fullPath = `${baseUrl}/api/v1/shutter`;
    try {
      const response = await axios.put<IModifyShutterResponse>(
        fullPath,
        request,
        this.prepareAxiosConfig(),
      );
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  async deleteShutter(
    request: IDeleteShutterRequest,
  ): Promise<IDeleteShutterResponse> {
    const baseUrl = this.appConfig.somfyShuttersServiceURL();
    const fullPath = `${baseUrl}/api/v1/shutter/${request.shutterId}`;
    try {
      const response = await axios.delete<IDeleteShutterResponse>(
        fullPath,
        this.prepareAxiosConfig(),
      );
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  async listShutters(): Promise<IListShuttersResponse> {
    const baseUrl = this.appConfig.somfyShuttersServiceURL();
    const fullPath = `${baseUrl}/api/v1/shutter`;
    try {
      const response = await axios.get<IListShuttersResponse>(
        fullPath,
        this.prepareAxiosConfig(),
      );
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  async raiseShutter(
    request: IRaiseShutterRequest,
  ): Promise<IRaiseShutterResponse> {
    const baseUrl = this.appConfig.somfyShuttersServiceURL();
    const fullPath = `${baseUrl}/api/v1/operateShutter/raise`;
    try {
      const response = await axios.post(
        fullPath,
        request,
        this.prepareAxiosConfig(),
      );
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  async lowerShutter(
    request: ILowerShutterRequest,
  ): Promise<ILowerShutterResponse> {
    const baseUrl = this.appConfig.somfyShuttersServiceURL();
    const fullPath = `${baseUrl}/api/v1/operateShutter/lower`;
    try {
      const response = await axios.post(
        fullPath,
        request,
        this.prepareAxiosConfig(),
      );
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  async stopShutter(
    request: IStopShutterRequest,
  ): Promise<IStopShutterResponse> {
    const baseUrl = this.appConfig.somfyShuttersServiceURL();
    const fullPath = `${baseUrl}/api/v1/operateShutter/stop`;
    try {
      const response = await axios.post(
        fullPath,
        request,
        this.prepareAxiosConfig(),
      );
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  async programShutter(
    request: IProgramShutterRequest,
  ): Promise<IProgramShutterResponse> {
    const baseUrl = this.appConfig.somfyShuttersServiceURL();
    const fullPath = `${baseUrl}/api/v1/operateShutter/program`;
    try {
      const response = await axios.post(
        fullPath,
        request,
        this.prepareAxiosConfig(),
      );
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  private prepareAxiosConfig(): AxiosRequestConfig {
    const config: AxiosRequestConfig = {
      headers: {
        "x-api-key": this.appConfig.somfyShuttersServiceApiKey(),
      },
    };
    return config;
  }

  private handleError(error: unknown) {
    if (isAxiosError(error)) {
      console.log("Got axios error : ", {
        status: error.status,
        code: error.code,
        message: error.message,
        name: error.name,
      });
      if (
        error.response &&
        error.response.data.errorCode &&
        error.response.data.description
      ) {
        throw new AppError(
          error.response.data.errorCode,
          error.response.data.description,
          error.response.data.payload,
        );
      }
    } else {
      console.log("Got unhandled error : ", error);
    }
  }
}
