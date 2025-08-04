import { withMiddleware } from "inversify-express-utils";
import * as express from "express";
import { UserRole } from "../models/models";
import { UnauthorizedError } from "../models/app-error";
import { ITokenService, tokenServiceKey } from "../services/token-service";
import { container } from "../ioc/container";

export function checkUserRole(role: UserRole) {
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
      if (!tokenInfos.roles.find((r) => r === role)) {
        throw new UnauthorizedError();
      }

      next();
    },
  );
}
