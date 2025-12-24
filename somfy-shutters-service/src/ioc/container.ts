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
import { SomfyShuttersController } from "../controllers/somfy-shutters-controller";
import { SomfyOperateShuttersController } from "../controllers/somfy-operate-controller";
import { errorFilterList } from "../middlewares/error-middleware";
import {
  CheckApiKeyInterceptor,
  checkApiKeyInterceptorKey,
} from "../middlewares/check-api-key-middleware";

export function setupContainer(): Container {
  const c: Container = new Container();

  c.bind(SomfyShuttersController).toSelf().inSingletonScope();
  c.bind(SomfyOperateShuttersController).toSelf().inSingletonScope();

  c.bind<CheckApiKeyInterceptor>(checkApiKeyInterceptorKey)
    .to(CheckApiKeyInterceptor)
    .inSingletonScope();

  errorFilterList.forEach((efl) => {
    c.bind(efl).toSelf().inSingletonScope();
  });

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
