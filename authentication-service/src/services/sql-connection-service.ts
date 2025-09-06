import "reflect-metadata";
import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { appConfigServiceKey, IAppConfigService } from "./app-config-service";
import { DataSource, DataSourceOptions } from "typeorm";
import { UserEntity } from "../entities/user";
import { RefreshTokenEntity } from "../entities/refresh-token";
import { InitialMigration1753360597960 } from "../migrations/1753360597960-InitialMigration";
import { AddRoleInUserTable1753382072367 } from "../migrations/1753382072367-AddRoleInUserTable";
import { Migrations1755530698256 } from "../migrations/1755530698256-CreateRefreshTokenTable";

export const sqlConnectionServiceKey = "SqlConnectionService";

export interface ISqlConnectionService {
  getConnection(): Promise<DataSource>;
}

@provide(sqlConnectionServiceKey)
export class SqlConnectionService implements ISqlConnectionService {
  private dataSource: DataSource | undefined;

  constructor(
    @inject(appConfigServiceKey) private readonly appConfig: IAppConfigService,
  ) {}

  async getConnection(): Promise<DataSource> {
    if (this.dataSource) {
      return this.dataSource;
    }
    return this.init();
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
        logging: ["log", "migration", "warn", "query", "error"],
        entities: [UserEntity, RefreshTokenEntity],
        migrations: [
          InitialMigration1753360597960,
          AddRoleInUserTable1753382072367,
          Migrations1755530698256,
        ],
      };
      const ds = new DataSource(connectionOptions);
      await ds.initialize();

      if (ds.isInitialized) {
        ds.runMigrations();
        this.dataSource = ds;
        return ds;
      }
      throw new Error();
    }
    return this.dataSource;
  }
}
