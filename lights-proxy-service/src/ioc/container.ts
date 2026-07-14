import { Container } from "inversify";
import {
  AppConfigServiceFromEnv,
  appConfigServiceKey,
  type IAppConfigService,
} from "../services/app-config-service";
import {
  type ILightProxyService,
  LightProxyService,
  lightProxyServiceKey,
} from "../services/lights-proxy-service";
import {
  ILightsService,
  LightsService,
  lightsServiceKey,
} from "../services/lights-service";
import {
  type ISqlConnectionService,
  SqlConnectionService,
  sqlConnectionServiceKey,
} from "../services/sql-connection-service";
import {
  ILightRepository,
  LightRepository,
  lightsRepositoryKey,
} from "../repositories/light-repository";
import { LightsManagementController } from "../controllers/lights-management-controller";
import { LightsOperateController } from "../controllers/lights-operate-controller";
import { errorFilterList } from "../middlewares/error-middleware";
import {
  CheckApiKeyInterceptor,
  checkApiKeyInterceptorKey,
} from "../middlewares/check-api-key-middleware";

export function setupContainer(): Container {
  const c: Container = new Container();

  c.bind(LightsManagementController).toSelf().inSingletonScope();
  c.bind(LightsOperateController).toSelf().inSingletonScope();

  c.bind<CheckApiKeyInterceptor>(checkApiKeyInterceptorKey)
    .to(CheckApiKeyInterceptor)
    .inSingletonScope();

  errorFilterList.forEach((efl) => {
    c.bind(efl).toSelf().inSingletonScope();
  });

  c.bind<IAppConfigService>(appConfigServiceKey)
    .to(AppConfigServiceFromEnv)
    .inSingletonScope();
  c.bind<ILightProxyService>(lightProxyServiceKey)
    .to(LightProxyService)
    .inSingletonScope();
  c.bind<ILightsService>(lightsServiceKey).to(LightsService).inSingletonScope();
  c.bind<ISqlConnectionService>(sqlConnectionServiceKey)
    .to(SqlConnectionService)
    .inSingletonScope();
  c.bind<ILightRepository>(lightsRepositoryKey)
    .to(LightRepository)
    .inSingletonScope();

  return c;
}

const container = setupContainer();
console.log("Container initialized");
export { container };
