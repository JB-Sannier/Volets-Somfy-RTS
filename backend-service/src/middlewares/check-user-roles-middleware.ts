import { withMiddleware } from "inversify-express-utils";
import * as express from "express";
import { UserRole } from "../models/models";
import { ErrorCodes, ErrorDescriptions } from "../models/app-error";
import { ITokenService, tokenServiceKey } from "../services/token-service";
import { container } from "../ioc/container";

export function checkUserRole(role: UserRole) {
  return withMiddleware(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (!req.headers.authorization) {
        res.status(401).json({
          errorCode: ErrorCodes.Unauthorized,
          errorDescriptions: ErrorDescriptions.Unauthorized,
          payload: {},
        });
        return;
      }
      try {
        const tokenService = container.get<ITokenService>(tokenServiceKey);
        const tokenInfos = await tokenService.validateToken(
          req.headers.authorization,
        );
        if (!tokenInfos.roles.find((r) => r === role)) {
          res.status(401).json({
            errorCode: ErrorCodes.Unauthorized,
            errorDescriptions: ErrorDescriptions.Unauthorized,
            payload: {},
          });
          return;
        }
        next();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        res.status(401).json({
          errorCode: ErrorCodes.Unauthorized,
          errorDescriptions: ErrorDescriptions.Unauthorized,
          payload: {},
        });
      }
    },
  );
}
