import { Container } from "inversify";
import {
  AppConfigServiceFromEnv,
  appConfigServiceKey,
  IAppConfigService,
} from "../services/app-config-service";
import "../controllers/authentication-controller";
import "../controllers/shutters-controller";
import "../controllers/shutters-operations-controller";
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
import {
  IShuttersProxyService,
  ShuttersProxyService,
  shuttersProxyServiceKey,
} from "../services/shutters-proxy-service";
import { AuthenticationController } from "../controllers/authentication-controller";
import { ShuttersController } from "../controllers/shutters-controller";
import { ShuttersOperationsController } from "../controllers/shutters-operations-controller";
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
import {
  CorsMiddleware,
  corsMiddlewareKey,
} from "../middlewares/cors-middleware";

export function setupContainer(): Container {
  const c: Container = new Container();

  c.bind<CorsMiddleware>(corsMiddlewareKey)
    .to(CorsMiddleware)
    .inSingletonScope();

  c.bind(AuthenticationController).toSelf().inSingletonScope();
  c.bind(ShuttersController).toSelf().inSingletonScope();
  c.bind(ShuttersOperationsController).toSelf().inSingletonScope();

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

  c.bind<IUserService>(userServiceKey).to(UserService).inSingletonScope();

  c.bind<ITokenService>(tokenServiceKey).to(TokenService).inSingletonScope();

  c.bind<IShuttersProxyService>(shuttersProxyServiceKey)
    .to(ShuttersProxyService)
    .inSingletonScope();

  return c;
}

const container = setupContainer();
console.log("Container initialized");
export { container };
