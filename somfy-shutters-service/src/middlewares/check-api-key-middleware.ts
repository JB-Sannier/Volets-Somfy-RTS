import * as express from "express";
import { UnauthorizedError } from "../models/app-error";
import { container } from "../ioc/container";
import {
  appConfigServiceKey,
  IAppConfigService,
} from "../services/app-config-service";
import { provide } from "@inversifyjs/binding-decorators";
import { ExpressInterceptor } from "@inversifyjs/http-express";
import {
  InterceptorTransformObject,
  UseInterceptor,
} from "@inversifyjs/http-core";

export const checkApiKeyInterceptorKey = Symbol.for("CheckApiKeyInterceptor");

@provide(checkApiKeyInterceptorKey)
export class CheckApiKeyInterceptor implements ExpressInterceptor {
  public async intercept(
    request: express.Request,
    _response: express.Response,
    next: () => Promise<InterceptorTransformObject>,
  ): Promise<void> {
    if (!request.headers["x-api-key"]) {
      throw new UnauthorizedError();
    }
    const clientXApiKey = request.headers["x-api-key"];
    const appConfig = container.get<IAppConfigService>(appConfigServiceKey);
    if (clientXApiKey !== appConfig.selfApiKey()) {
      throw new UnauthorizedError();
    }
    await next();
  }
}

export function checkApiKey() {
  return UseInterceptor(checkApiKeyInterceptorKey);
}
