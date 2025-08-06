import "reflect-metadata";
import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { appConfigServiceKey, IAppConfigService } from "./app-config-service";
import { DataSource } from "typeorm";

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
      const ds = new DataSource({
        type: "postgres",
        host: this.appConfig.dbHostName(),
        port: this.appConfig.dbPort(),
        username: this.appConfig.dbUserName(),
        password: this.appConfig.dbPassword(),
        database: this.appConfig.dbName(),
        schema: this.appConfig.dbSchema(),
        entities: [
          `${__dirname}/../entities/*.ts`,
          `${__dirname}/../entities/*.js`,
        ],
        migrations: [`${__dirname}/../migrations/1754473503534-migrations.ts`],
        migrationsRun: true,

        logger: "simple-console",
        logNotifications: true,
        logging: ["migration", "warn", "error"],
      });
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
