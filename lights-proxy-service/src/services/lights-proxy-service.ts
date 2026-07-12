import { provide } from "@inversifyjs/binding-decorators";
import { inject } from "inversify";
import {
  appConfigServiceKey,
  type IAppConfigService,
} from "./app-config-service";
import { LightProxyServiceError } from "../models/app-error";
import { ILight } from "../models/light";

export const lightProxyServiceKey = Symbol.for("LightsProxyService");

export interface ILightProxyService {
  switchOn(light: ILight): Promise<boolean>;
  switchOff(light: ILight): Promise<boolean>;
  switchLight(light: ILight): Promise<boolean>;
}

@provide(lightProxyServiceKey)
export class LightProxyService implements ILightProxyService {
  constructor(
    @inject(appConfigServiceKey) private readonly appConfig: IAppConfigService,
  ) { }

  async switchOn(light: ILight): Promise<boolean> {
    return this.sendCommand(light, true);
  }

  async switchOff(light: ILight): Promise<boolean> {
    return this.sendCommand(light, false);
  }

  async switchLight(light: ILight): Promise<boolean> {
    return this.sendCommand(light, true);
  }

  private async sendCommand(light: ILight, on: boolean): Promise<boolean> {
    const commandNumber = on ? light.switchOnCode : light.switchOffCode;
    const proxyUrl = this.appConfig.lightsServerHostName();
    const proxyPort = this.appConfig.lightsServerPort();
    const baseUrl = `http://${proxyUrl}:${proxyPort}`;
    const url = new URL(`${baseUrl}/lights/sendCommand`);
    const bodyInit: BodyInit = JSON.stringify({
      code: commandNumber,
      pulseDelay: light.pulseLength,
      protocol: light.protocol,
      frequency: light.frequency,
    });
    const response = await fetch(url, {
      method: "POST",
      body: bodyInit,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.appConfig.lightsApiKey(),
      },
    });
    if (response.ok) {
      return true;
    }
    throw new LightProxyServiceError({
      headers: response.headers,
      status: response.status,
      text: await response.text(),
    });
  }
}
