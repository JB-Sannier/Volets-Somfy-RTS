import { withMiddleware } from "inversify-express-utils";
import * as express from "express";
import { ErrorCodes, ErrorDescriptions } from "../models/app-error";
import { container } from "../ioc/container";
import { ITokenService, tokenServiceKey } from "../services/token-service";

export function checkToken() {
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
        if (tokenInfos) {
          next();
        }
      } catch (error) {
        console.log(
          "CheckTokenMiddleware : error while trying to validate token :",
          error,
        );
      }
    },
  );
}
