import { withMiddleware } from "inversify-express-utils";
import * as express from "express";
import { UnauthorizedError } from "../models/app-error";
import { container } from "../ioc/container";
import {
  appConfigServiceKey,
  IAppConfigService,
} from "../services/app-config-service";

export function checkApiKey() {
  return withMiddleware(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (!req.headers["x-api-key"]) {
        throw new UnauthorizedError();
      }
      const clientXApiKey = req.headers["x-api-key"];
      const appConfig = container.get<IAppConfigService>(appConfigServiceKey);
      if (clientXApiKey !== appConfig.selfApiKey()) {
        throw new UnauthorizedError();
      }
      next();
    },
  );
}
