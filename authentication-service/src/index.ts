import "reflect-metadata";
import { container } from "./ioc/container";
import { InversifyExpressHttpAdapter } from "@inversifyjs/http-express";
import {
  appConfigServiceKey,
  IAppConfigService,
} from "./services/app-config-service";
import {
  ISqlConnectionService,
  sqlConnectionServiceKey,
} from "./services/sql-connection-service";
import {
  errorFilterList,
} from "./middlewares/error-middleware";
import { IUserService, userServiceKey } from "./services/user-service";

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
  const sqlService = container.get<ISqlConnectionService>(
    sqlConnectionServiceKey
  );

  await sqlService.getConnection();

  // While we don't have a User with UserRole.UserManager in DB, use a default user
  const userService = container.get<IUserService>(userServiceKey);
  userService.setDefaultUserIfNeeded();

}

init();
