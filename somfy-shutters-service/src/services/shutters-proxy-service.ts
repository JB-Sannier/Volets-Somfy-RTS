import { provide } from "@inversifyjs/binding-decorators";
import { inject } from "inversify";
import { appConfigServiceKey, IAppConfigService } from "./app-config-service";
import { SomfyProxyServiceError } from "../models/app-error";

export const shutterProxyServiceKey = Symbol.for("ShuttersProxyService");

export interface IShutterProxyService {
  addShutter(shutterName: string): Promise<string>;
  deleteShutter(shutterProxyId: string): Promise<boolean>;
  raiseShutter(shutterProxyId: string): Promise<boolean>;
  lowerShutter(shutterProxyId: string): Promise<boolean>;
  stopShutter(shutterProxyId: string): Promise<boolean>;
  programShutter(shutterProxyId: string): Promise<boolean>;
}

interface IParameters {
  [parameterName: string]: string;
}

@provide(shutterProxyServiceKey)
export class ShutterProxyService implements IShutterProxyService {
  constructor(
    @inject(appConfigServiceKey) private readonly appConfig: IAppConfigService,
  ) {}

  async addShutter(shutterName: string): Promise<string> {
    const request = this.prepareRequest("addShutter", {
      name: shutterName,
      duration: "10",
    });
    const response = await fetch(request);
    if (response.ok) {
      const responseBody = await response.json();
      return responseBody.id;
    }
    throw new SomfyProxyServiceError({
      headers: response.headers,
      status: response.status,
      text: await response.text(),
      aaa: await response.json(),
    });
  }

  async deleteShutter(shutterProxyId: string): Promise<boolean> {
    return this.processSimpleCommand("deleteShutter", shutterProxyId);
  }

  async raiseShutter(shutterProxyId: string): Promise<boolean> {
    return this.processSimpleCommand("up", shutterProxyId);
  }

  async lowerShutter(shutterProxyId: string): Promise<boolean> {
    return this.processSimpleCommand("down", shutterProxyId);
  }

  async stopShutter(shutterProxyId: string): Promise<boolean> {
    return this.processSimpleCommand("stop", shutterProxyId);
  }

  async programShutter(shutterProxyId: string): Promise<boolean> {
    return this.processSimpleCommand("program", shutterProxyId);
  }

  private async processSimpleCommand(
    command: string,
    shutterProxyId: string,
  ): Promise<boolean> {
    const request = this.prepareRequest(command, {
      shutter: shutterProxyId,
    });
    const response = await fetch(request);
    if (response.ok) {
      return true;
    }
    throw new SomfyProxyServiceError({
      headers: response.headers,
      status: response.status,
      text: await response.text(),
      aaa: await response.json(),
    });
  }

  private prepareRequest(command: string, parameters: IParameters): Request {
    const proxyUrl = this.appConfig.somfyServerHostName();
    const proxyPort = this.appConfig.somfyServerPort();
    const baseUrl = `http://${proxyUrl}:${proxyPort}`;
    const url = new URL(`${baseUrl}/cmd/${command}`);
    for (const [key, value] of Object.entries(parameters)) {
      url.searchParams.set(key, value);
    }
    const request: Request = new Request(url, {
      method: "GET",
    });
    request.headers.append("Password", this.appConfig.somfyPassword());
    return request;
  }
}
