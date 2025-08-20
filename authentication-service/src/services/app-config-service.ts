import { provide } from "inversify-binding-decorators";
import * as process from "process";
import * as dotenv from "dotenv";

export const appConfigServiceKey = "AppConfigService";

export interface IAppConfigService {
  environment(): string;
  port(): number;
  host(): string;
  dbHostName(): string;
  dbPort(): number;
  dbUserName(): string;
  dbPassword(): string;
  dbName(): string;
  dbSchema(): string;
  refreshTokenSigningKey(): string;
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
    return process.env.HOSTNAME || "127.0.0.1";
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

  refreshTokenSigningKey(): string {
    return process.env.REFRESH_TOKEN_SIGNING_KEY || "";
  }
}
