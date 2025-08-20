export interface IAppConfig {
  port: number;
  host: string;
  dbHostName: string;
  dbPort: string;
  dbUserName: string;
  dbPassword: string;
  dbName: string;
  refreshTokenSigningKey: string;
}
