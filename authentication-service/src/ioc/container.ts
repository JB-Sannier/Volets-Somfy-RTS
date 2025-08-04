import { Container } from "inversify";
import {
  AppConfigServiceFromEnv,
  appConfigServiceKey,
  IAppConfigService,
} from "../services/app-config-service";
import {
  ISqlConnectionService,
  SqlConnectionService,
  sqlConnectionServiceKey,
} from "../services/sql-connection-service";
import "../controllers/authentication-controller";
import {
  IUserRepository,
  UserRepository,
  userRepositoryKey,
} from "../repositories/user-repository";
import {
  IUserService,
  UserService,
  userServiceKey,
} from "../services/user-service";
import {
  ITokenService,
  TokenService,
  tokenServiceKey,
} from "../services/token-service";
import "../controllers/authentication-controller";
import "../controllers/users-controller";

export function setupContainer(): Container {
  const c: Container = new Container();

  c.bind<IAppConfigService>(appConfigServiceKey)
    .to(AppConfigServiceFromEnv)
    .inSingletonScope();

  c.bind<ISqlConnectionService>(sqlConnectionServiceKey)
    .to(SqlConnectionService)
    .inSingletonScope();

  c.bind<IUserRepository>(userRepositoryKey)
    .to(UserRepository)
    .inSingletonScope();

  c.bind<IUserService>(userServiceKey).to(UserService).inSingletonScope();

  c.bind<ITokenService>(tokenServiceKey).to(TokenService).inSingletonScope();

  return c;
}

const container = setupContainer();
console.log("Container initialized");
export { container };
