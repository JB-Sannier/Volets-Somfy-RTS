import { withMiddleware } from "inversify-express-utils";
import * as express from "express";
import { UnauthorizedError } from "../models/app-error";
import { container } from "../ioc/container";
import { ITokenService, tokenServiceKey } from "../services/token-service";

export function checkToken() {
  return withMiddleware(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (!req.headers.authorization) {
        throw new UnauthorizedError();
      }
      const tokenService = container.get<ITokenService>(tokenServiceKey);
      const tokenInfos = tokenService.validateToken(req.headers.authorization);
      if (tokenInfos) {
        next();
      }
    },
  );
}
