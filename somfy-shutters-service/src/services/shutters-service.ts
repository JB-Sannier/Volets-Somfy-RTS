import { inject } from "inversify";
import { provide } from "@inversifyjs/binding-decorators";
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
  IShutterResponse,
  IStopShutterRequest,
  IStopShutterResponse,
} from "../requests/requests";
import {
  IShutterRepository,
  shuttersRepositoryKey,
} from "../repositories/shutters-repository";
import { ShutterNotFoundError } from "../models/app-error";
import {
  IShutterProxyService,
  shutterProxyServiceKey,
} from "./shutters-proxy-service";

export interface IShutterService {
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

export const shutterServiceKey = "ShutterServiceKey";

@provide(shutterServiceKey)
export class ShutterService implements IShutterService {
  constructor(
    @inject(shuttersRepositoryKey)
    private readonly shutterRepository: IShutterRepository,
    @inject(shutterProxyServiceKey)
    private readonly proxyService: IShutterProxyService,
  ) {}

  async addShutter(request: IAddShutterRequest): Promise<IAddShutterResponse> {
    const shutterProxyId = await this.proxyService.addShutter(
      request.shutterName,
    );
    const result = await this.shutterRepository.addShutter(
      request.shutterName,
      shutterProxyId,
    );
    return {
      shutterId: result.shutterId,
      shutterName: result.shutterName,
    };
  }

  async getShutter(request: IGetShutterRequest): Promise<IGetShutterResponse> {
    const shutter = await this.shutterRepository.getShutter(request.shutterId);
    if (!shutter) {
      throw new ShutterNotFoundError(request.shutterId);
    }
    return shutter;
  }

  async modifyShutter(
    request: IModifyShutterRequest,
  ): Promise<IModifyShutterResponse> {
    const shutter = await this.shutterRepository.getShutter(request.shutterId);
    if (!shutter) {
      throw new ShutterNotFoundError(request.shutterId);
    }
    shutter.shutterName = request.shutterName;
    await this.shutterRepository.modifyShutter(shutter);
    return {
      shutterId: shutter.shutterId,
      shutterName: shutter.shutterName,
    };
  }

  async deleteShutter(
    request: IDeleteShutterRequest,
  ): Promise<IDeleteShutterResponse> {
    const shutterFound = await this.shutterRepository.getShutter(
      request.shutterId,
    );
    if (!shutterFound) {
      throw new ShutterNotFoundError(request.shutterId);
    }
    await this.shutterRepository.deleteShutter(shutterFound);
    return {
      shutterId: shutterFound.shutterId,
      shutterName: shutterFound.shutterName,
    };
  }

  async listShutters(): Promise<IListShuttersResponse> {
    const shutters = await this.shutterRepository.listShutters();
    return shutters.map((shutter): IShutterResponse => {
      return {
        shutterId: shutter.shutterId,
        shutterName: shutter.shutterName,
      };
    });
  }

  async raiseShutter(
    request: IRaiseShutterRequest,
  ): Promise<IRaiseShutterResponse> {
    const shutter = await this.shutterRepository.getShutter(request.shutterId);
    if (!shutter) {
      throw new ShutterNotFoundError(request.shutterId);
    }
    await this.proxyService.raiseShutter(shutter.proxyShutterId);
    return { status: "Ok" };
  }

  async lowerShutter(
    request: ILowerShutterRequest,
  ): Promise<ILowerShutterResponse> {
    const shutter = await this.shutterRepository.getShutter(request.shutterId);
    if (!shutter) {
      throw new ShutterNotFoundError(request.shutterId);
    }
    await this.proxyService.lowerShutter(shutter.proxyShutterId);
    return { status: "Ok" };
  }

  async stopShutter(
    request: IStopShutterRequest,
  ): Promise<IStopShutterResponse> {
    const shutter = await this.shutterRepository.getShutter(request.shutterId);
    if (!shutter) {
      throw new ShutterNotFoundError(request.shutterId);
    }
    await this.proxyService.stopShutter(shutter.proxyShutterId);
    return { status: "Ok" };
  }

  async programShutter(
    request: IProgramShutterRequest,
  ): Promise<IProgramShutterResponse> {
    const shutter = await this.shutterRepository.getShutter(request.shutterId);
    if (!shutter) {
      throw new ShutterNotFoundError(request.shutterId);
    }
    await this.proxyService.programShutter(shutter.proxyShutterId);
    return { status: "Ok" };
  }
}
