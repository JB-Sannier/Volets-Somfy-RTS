import { provide } from "@inversifyjs/binding-decorators";
import * as process from "process";
import * as dotenv from "dotenv";

export const appConfigServiceKey = "AppConfigService";

export interface IAppConfigService {
  environment(): string;
  port(): number;
  host(): string;
  somfyServerHostName(): string;
  somfyServerPort(): number;
  somfyPassword(): string;
  selfApiKey(): string;
  dbHostName(): string;
  dbPort(): number;
  dbUserName(): string;
  dbPassword(): string;
  dbName(): string;
  dbSchema(): string;
}

@provide(appConfigServiceKey)
export class AppConfigServiceFromEnv implements IAppConfigService {
  constructor() {
    dotenv.config({ quiet: true });
  }

  environment(): string {
    return process.env.ENV || "dev";
  }

  host(): string {
    return process.env.HOSTNAME || "127.0.0.1";
  }

  port(): number {
    return parseInt(process.env.PORT || "3001");
  }

  somfyServerHostName(): string {
    return process.env.SOMFY_SERVER_HOST_NAME || "127.0.0.1";
  }

  somfyServerPort(): number {
    return parseInt(process.env.SOMFY_SERVER_PORT || "3000");
  }

  somfyPassword(): string {
    return process.env.SOMFY_SERVER_PASSWORD || "";
  }

  selfApiKey(): string {
    return process.env.SELF_API_KEY || "not-defined";
  }

  dbHostName(): string {
    return process.env.DB_HOSTNAME || "";
  }

  dbPort(): number {
    return parseInt(process.env.DB_PORT || "5432");
  }

  dbUserName(): string {
    return process.env.DB_USERNAME || "";
  }

  dbPassword(): string {
    return process.env.DB_PASSWORD || "";
  }

  dbName(): string {
    return process.env.DB_NAME || "";
  }

  dbSchema(): string {
    return process.env.DB_SCHEMA || "";
  }
}
