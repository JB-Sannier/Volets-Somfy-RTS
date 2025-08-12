import "reflect-metadata";
import * as bodyParser from "body-parser";
import * as express from "express";
import { setupContainer } from "./ioc/container";
import { InversifyExpressServer } from "inversify-express-utils";
import {
  appConfigServiceKey,
  IAppConfigService,
} from "./services/app-config-service";
import { errorHandler } from "./middlewares/error-middleware";

async function init() {
  const container = setupContainer();
  const appConfig = container.get<IAppConfigService>(appConfigServiceKey);

  const server = new InversifyExpressServer(container);
  server.setConfig((app: express.Application) => {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
  });
  server.setErrorConfig((app) => {
    app.use(errorHandler);
  });

  const app: express.Application = server.build();

  app.listen(appConfig.port(), appConfig.host(), () => {
    console.log("Listening on : ", appConfig.host(), appConfig.port());
  });
}

init();
