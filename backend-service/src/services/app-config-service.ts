import { provide } from "inversify-binding-decorators";
import * as process from "process";
import * as dotenv from "dotenv";

export const appConfigServiceKey = "AppConfigService";

export interface IAppConfigService {
  environment(): string;
  port(): number;
  host(): string;

  authenticationServiceURL(): string;
  somfyShuttersServiceURL(): string;
  somfyShuttersServiceApiKey(): string;
}

@provide(appConfigServiceKey)
export class AppConfigServiceFromEnv implements IAppConfigService {
  constructor() {
    dotenv.config({ quiet: true });
  }

  environment(): string {
    return process.env.ENV || "dev";
  }

  port(): number {
    return parseInt(process.env.PORT || "3001");
  }

  host(): string {
    return process.env.HOST || "127.0.0.1";
  }

  authenticationServiceURL(): string {
    return process.env.AUTHENTICATION_SERVICE_URL || "";
  }

  somfyShuttersServiceURL(): string {
    return process.env.SOMFY_SHUTTERS_SERVICE_URL || "";
  }

  somfyShuttersServiceApiKey(): string {
    return process.env.SOMFY_SHUTTERS_SERVICE_API_KEY || "";
  }
}
