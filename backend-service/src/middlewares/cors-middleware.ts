import * as express from "express";
import { provide } from "@inversifyjs/binding-decorators";
import { ExpressMiddleware } from "@inversifyjs/http-express";
import cors from "cors";

export const corsMiddlewareKey = Symbol.for("CorsInterceptor");

export const appCors = cors({ origin: "*" });

@provide(corsMiddlewareKey)
export class CorsMiddleware implements ExpressMiddleware {
  public execute(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ): void {
    const method = request.method;
    const path = request.path;
    console.log("Applying cors (%s : %s)", method, path);
    appCors(request, response, next);
  }
}
