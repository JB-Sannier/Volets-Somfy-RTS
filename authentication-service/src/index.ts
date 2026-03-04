import { InversifyExpressHttpAdapter } from "@inversifyjs/http-express";
import "reflect-metadata";
import { LessThan } from "typeorm";
import { RefreshTokenEntity } from "./entities/refresh-token";
import { container } from "./ioc/container";
import { errorFilterList } from "./middlewares/error-middleware";
import {
  appConfigServiceKey,
  IAppConfigService,
} from "./services/app-config-service";
import {
  ISqlConnectionService,
  sqlConnectionServiceKey,
} from "./services/sql-connection-service";
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

  // Cleanup expired refresh tokens hourly
  const cleanupInterval = setInterval(async () => {
    try {
      const ds = await sqlService.getConnection();
      await ds.manager.delete(RefreshTokenEntity, {
        expiration: LessThan(new Date()),
      });
    } catch (err) {
      console.error("Failed to cleanup expired refresh tokens:", err);
    }
  }, 60 * 60 * 1000);

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    clearInterval(cleanupInterval);
    try {
      const ds = await sqlService.getConnection();
      await ds.destroy();
    } catch (err) {
      console.error("Error during graceful shutdown:", err);
    }
    process.exit(0);
  });
}

init();
