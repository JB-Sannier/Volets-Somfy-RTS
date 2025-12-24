import "reflect-metadata";
import { container } from "./ioc/container";
import { InversifyExpressHttpAdapter } from "@inversifyjs/http-express";
import {
  appConfigServiceKey,
  IAppConfigService,
} from "./services/app-config-service";
import { errorFilterList } from "./middlewares/error-middleware";
import { appCors, corsMiddlewareKey } from "./middlewares/cors-middleware";

async function init() {
  const appConfig = container.get<IAppConfigService>(appConfigServiceKey);

  const adapter = new InversifyExpressHttpAdapter(container, {
    useUrlEncoded: true,
    useJson: true,
    useCookies: true,
    logger: true,
  });
  adapter.applyGlobalMiddleware(corsMiddlewareKey);
  adapter.useGlobalFilters(...errorFilterList);

  const app = await adapter.build();
  app.use(appCors);
  app.listen(appConfig.port(), appConfig.host(), () => {
    console.log("Listening on : ", appConfig.host(), appConfig.port());
  });
}

init();
