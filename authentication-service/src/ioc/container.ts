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
import {
  IRefreshTokenRepository,
  RefreshTokenRepository,
  refreshTokenRepositoryKey,
} from "../repositories/refresh-token-repository";
import {
  IRefreshTokenService,
  RefreshTokenService,
  refreshTokenServiceKey,
} from "../services/refresh-token-sevice";
import "../controllers/authentication-controller";
import "../controllers/users-controller";
import "../middlewares/check-token-middleware";
import "../middlewares/check-user-roles-middleware";
import "../middlewares/error-middleware";

import { AuthenticationController } from "../controllers/authentication-controller";
import { UsersController } from "../controllers/users-controller";
import { errorFilterList } from "../middlewares/error-middleware";
import {
  CheckShutterManagerRole,
  checkShutterManagerRoleKey,
  CheckUserManagerRole,
  checkUserManagerRoleKey,
} from "../middlewares/check-user-roles-middleware";
import {
  TokenCheckInterceptor,
  tokenCheckInterceptorKey,
} from "../middlewares/check-token-middleware";

export function setupContainer(): Container {
  const c: Container = new Container();

  c.bind(AuthenticationController).toSelf().inSingletonScope();
  c.bind(UsersController).toSelf().inSingletonScope();

  errorFilterList.forEach((efl) => {
    c.bind(efl).toSelf().inSingletonScope();
  });

  c.bind<CheckUserManagerRole>(checkUserManagerRoleKey)
    .to(CheckUserManagerRole)
    .inSingletonScope();
  c.bind<CheckShutterManagerRole>(checkShutterManagerRoleKey)
    .to(CheckShutterManagerRole)
    .inSingletonScope();
  c.bind<TokenCheckInterceptor>(tokenCheckInterceptorKey)
    .to(TokenCheckInterceptor)
    .inSingletonScope();

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
  c.bind<IRefreshTokenRepository>(refreshTokenRepositoryKey)
    .to(RefreshTokenRepository)
    .inSingletonScope();
  c.bind<IRefreshTokenService>(refreshTokenServiceKey)
    .to(RefreshTokenService)
    .inSingletonScope();
  return c;
}

const container = setupContainer();
console.log("Container initialized");
export { container };
