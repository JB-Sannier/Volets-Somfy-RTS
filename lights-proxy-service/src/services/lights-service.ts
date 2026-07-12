import { inject } from "inversify";
import { provide } from "@inversifyjs/binding-decorators";
import {
  ILightRepository,
  lightsRepositoryKey,
} from "../repositories/light-repository";
import { ILight } from "../models/light";
import {
  CannotDeleteLightError,
  CannotUpdateLightError,
  LightNotFoundError,
} from "../models/app-error";
import {
  ILightProxyService,
  lightProxyServiceKey,
} from "./lights-proxy-service";
import {
  IAddLightRequest,
  IDeleteLightRequest,
  IGetLightRequest,
  IImportLightsRequest,
  ISwitchLightRequest,
  IUpdateLightRequest,
} from "../requests/requests";

export const lightsServiceKey = Symbol.for("LightsService");

export interface ILightsService {
  getAllLights(): Promise<ILight[]>;
  getLight(request: IGetLightRequest): Promise<ILight>;
  addLight(request: IAddLightRequest): Promise<ILight>;
  updateLight(request: IUpdateLightRequest): Promise<void>;
  deleteLight(request: IDeleteLightRequest): Promise<void>;
  importLights(request: IImportLightsRequest): Promise<void>;
  switchOn(request: ISwitchLightRequest): Promise<void>;
  switchOff(request: IGetLightRequest): Promise<void>;
}

@provide(lightsServiceKey)
export class LightsService implements ILightsService {
  constructor(
    @inject(lightsRepositoryKey)
    private readonly lightRepository: ILightRepository,
    @inject(lightProxyServiceKey)
    private readonly lightProxyService: ILightProxyService,
  ) {}

  async getLight(request: IGetLightRequest): Promise<ILight> {
    const light = await this.lightRepository.getLight(request.lightId);
    if (!light) {
      throw new LightNotFoundError(request.lightId);
    }
    return light;
  }

  async getAllLights(): Promise<ILight[]> {
    return this.lightRepository.listLights();
  }

  async addLight(request: IAddLightRequest): Promise<ILight> {
    const createdLight: ILight = await this.lightRepository.addLight(request);
    return createdLight;
  }

  async updateLight(request: IUpdateLightRequest): Promise<void> {
    const updated = await this.lightRepository.modifyLight(request);
    if (!updated) {
      throw new CannotUpdateLightError(request.lightId);
    }
  }

  async deleteLight(request: IDeleteLightRequest): Promise<void> {
    const light = await this.lightRepository.getLight(request.lightId);
    if (!light) {
      throw new CannotDeleteLightError(request.lightId);
    }
    await this.lightRepository.deleteLight(light);
  }

  async importLights(request: IImportLightsRequest): Promise<void> {
    for (const light of request.lights) {
      const existingLight = await this.lightRepository.getLight(light.lightId);
      if (existingLight) {
        await this.lightRepository.modifyLight(light);
      } else {
        await this.lightRepository.addLight(light);
      }
    }
  }

  async switchOn(request: ISwitchLightRequest): Promise<void> {
    const light = await this.lightRepository.getLight(request.lightId);
    if (!light) {
      throw new LightNotFoundError(request.lightId);
    }
    await this.lightProxyService.switchOn(light);
  }

  async switchOff(request: IGetLightRequest): Promise<void> {
    const light = await this.lightRepository.getLight(request.lightId);
    if (!light) {
      throw new LightNotFoundError(request.lightId);
    }
    await this.lightProxyService.switchOff(light);
  }

  async switchLight(request: ISwitchLightRequest): Promise<void> {
    const light = await this.lightRepository.getLight(request.lightId);
    if (!light) {
      throw new LightNotFoundError(request.lightId);
    }
    await this.lightProxyService.switchLight(light);
  }
}
