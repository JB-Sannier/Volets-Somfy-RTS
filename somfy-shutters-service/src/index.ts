import "reflect-metadata";
import { } from "inversify";
import { container } from "./ioc/container";
import {
  appConfigServiceKey,
  IAppConfigService,
} from "./services/app-config-service";
import { errorFilterList } from "./middlewares/error-middleware";
import { ISqlConnectionService, sqlConnectionServiceKey } from "./services/sql-connection-service";
import { InversifyExpressHttpAdapter } from "@inversifyjs/http-express";

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

  const sqlService = container.get<ISqlConnectionService>(sqlConnectionServiceKey);
  await sqlService.getConnection();
}

init();