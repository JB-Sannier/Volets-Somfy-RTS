import { provide } from "@inversifyjs/binding-decorators";
import * as process from "node:process";
import * as dotenv from "dotenv";

export const appConfigServiceKey = "AppConfigService";

export interface IAppConfigService {
  environment(): string;
  port(): number;
  host(): string;
  lightsServerHostName(): string;
  lightsServerPort(): number;
  lightsApiKey(): string;
  dbHostName(): string;
  dbPort(): number;
  dbUserName(): string;
  dbPassword(): string;
  dbName(): string;
  dbSchema(): string;
  selfApiKey(): string;
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
    return parseInt(process.env.PORT || "3004", 10);
  }

  lightsServerHostName(): string {
    return process.env.LIGHTS_SERVER_HOST_NAME || "127.0.0.1";
  }

  lightsServerPort(): number {
    return parseInt(process.env.LIGHTS_SERVER_PORT || "3005", 10);
  }

  lightsApiKey(): string {
    return process.env.LIGHTS_SERVER_API_KEY || "";
  }

  dbHostName(): string {
    return process.env.DB_HOSTNAME || "localhost";
  }

  dbPort(): number {
    return parseInt(process.env.DB_PORT || "5432", 10);
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

  selfApiKey(): string {
    return process.env.SELF_API_KEY || "";
  }
}
