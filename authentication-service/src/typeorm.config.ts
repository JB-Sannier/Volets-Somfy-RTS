// typeorm.config.ts
import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";

config();

export const connectionOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOSTNAME,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,

  entities: [`${__dirname}/entities/**/*{.ts,.js}`],
  migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
};

export default new DataSource(connectionOptions);
