import { withMiddleware } from "inversify-express-utils";
import * as express from "express";
import { UserRole } from "../models/models";
import { ErrorCodes, ErrorDescriptions } from "../models/app-error";
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
        res.status(401).json({
          errorCode: ErrorCodes.Unauthorized,
          errorDescriptions: ErrorDescriptions.Unauthorized,
          payload: {},
        });
        return;
      }

      const tokenService = container.get<ITokenService>(tokenServiceKey);
      tokenService
        .validateToken(req.headers.authorization)
        .then((tokenInfos) => {
          if (!tokenInfos.roles.find((r) => r === role)) {
            res.status(401).json({
              errorCode: ErrorCodes.Unauthorized,
              errorDescriptions: ErrorDescriptions.Unauthorized,
              payload: {},
            });
            return;
          }
          next();
        })
        .catch((err: unknown) => {
          console.log(
            "CheckUserRole: error while trying to communicate to authentication service : ",
            err,
          );

          res.status(401).json({
            errorCode: ErrorCodes.Unauthorized,
            errorDescriptions: ErrorDescriptions.Unauthorized,
            payload: {},
          });
          return;
        });
    },
  );
}
