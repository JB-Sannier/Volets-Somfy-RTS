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

export function setupContainer(): Container {
  const c: Container = new Container();

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
