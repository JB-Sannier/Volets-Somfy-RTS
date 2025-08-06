import { Container } from "inversify";
import {
  AppConfigServiceFromEnv,
  appConfigServiceKey,
  IAppConfigService,
} from "../services/app-config-service";
import "../controllers/somfy-operate-controller";
import "../controllers/somfy-shutters-controller";
import {
  IShutterProxyService,
  ShutterProxyService,
  shutterProxyServiceKey,
} from "../services/shutters-proxy-service";
import {
  IShutterService,
  ShutterService,
  shutterServiceKey,
} from "../services/shutters-service";
import {
  ISqlConnectionService,
  SqlConnectionService,
  sqlConnectionServiceKey,
} from "../services/sql-connection-service";
import {
  IShutterRepository,
  ShutterRepository,
  shuttersRepositoryKey,
} from "../repositories/shutters-repository";

export function setupContainer(): Container {
  const c: Container = new Container();

  c.bind<IAppConfigService>(appConfigServiceKey)
    .to(AppConfigServiceFromEnv)
    .inSingletonScope();

  c.bind<IShutterProxyService>(shutterProxyServiceKey)
    .to(ShutterProxyService)
    .inSingletonScope();
  c.bind<IShutterService>(shutterServiceKey)
    .to(ShutterService)
    .inSingletonScope();
  c.bind<ISqlConnectionService>(sqlConnectionServiceKey)
    .to(SqlConnectionService)
    .inSingletonScope();
  c.bind<IShutterRepository>(shuttersRepositoryKey)
    .to(ShutterRepository)
    .inSingletonScope();

  return c;
}

const container = setupContainer();
console.log("Container initialized");
export { container };
