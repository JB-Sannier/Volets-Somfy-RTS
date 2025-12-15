import "reflect-metadata";
import { container } from "./ioc/container";
import { InversifyExpressHttpAdapter } from "@inversifyjs/http-express";
import {
  appConfigServiceKey,
  IAppConfigService,
} from "./services/app-config-service";
import { errorFilterList } from "./middlewares/error-middleware";

async function init() {
  const appConfig = container.get<IAppConfigService>(appConfigServiceKey);

  const adapter = new InversifyExpressHttpAdapter(container, {
    useUrlEncoded: true,
    useJson: true,
    useCookies: true,
  });
  adapter.useGlobalFilters(...errorFilterList);

  const app = await adapter.build();

  app.listen(appConfig.port(), appConfig.host(), () => {
    console.log("Listening on : ", appConfig.host(), appConfig.port());
  });
}

init();
