import { provide } from "@inversifyjs/binding-decorators";
import { inject } from "inversify";
import { DataSource, type DataSourceOptions } from "typeorm";
import { LightEntity } from "../entities/light-entity";
import { CreateLightTable1782639144812 } from "../migrations/1782639144812-create-light-table";

import {
  appConfigServiceKey,
  type IAppConfigService,
} from "./app-config-service";

export const sqlConnectionServiceKey = "SqlConnectionService";

export interface ISqlConnectionService {
  getConnection(): Promise<DataSource>;
}

@provide(sqlConnectionServiceKey)
export class SqlConnectionService implements ISqlConnectionService {
  private dataSource: DataSource | undefined;
  private initPromise: Promise<DataSource> | undefined;

  constructor(
    @inject(appConfigServiceKey) private readonly appConfig: IAppConfigService,
  ) {}

  async getConnection(): Promise<DataSource> {
    if (this.dataSource) {
      return this.dataSource;
    }
    if (!this.initPromise) {
      this.initPromise = this.init();
    }
    return this.initPromise;
  }

  private async init(): Promise<DataSource> {
    if (!this.dataSource) {
      const connectionOptions: DataSourceOptions = {
        type: "postgres",
        host: this.appConfig.dbHostName(),
        port: this.appConfig.dbPort(),
        username: this.appConfig.dbUserName(),
        password: this.appConfig.dbPassword(),
        database: this.appConfig.dbName(),
        schema: this.appConfig.dbSchema(),
        migrationsRun: true,
        logger: "simple-console",
        logNotifications: true,
        logging: ["log", "migration", "warn", "error"],
        entities: [LightEntity],
        migrations: [CreateLightTable1782639144812],
      };
      const ds = new DataSource(connectionOptions);
      await ds.initialize();

      if (ds.isInitialized) {
        await ds.runMigrations();
        this.dataSource = ds;
        return ds;
      }
      throw new Error();
    }
    return this.dataSource;
  }
}
