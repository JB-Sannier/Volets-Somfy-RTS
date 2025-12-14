import * as express from "express";
import { UnauthorizedError } from "../models/app-error";
import { container } from "../ioc/container";
import { ITokenService, tokenServiceKey } from "../services/token-service";
import {
  UseInterceptor,
  InterceptorTransformObject,
} from "@inversifyjs/http-core";
import { ExpressInterceptor } from "@inversifyjs/http-express";
import { ITokenInformations } from "../models/requests";
import { provide } from "@inversifyjs/binding-decorators";

export const tokenCheckInterceptorKey = Symbol.for('TokenCheckInterceptor');

export interface IAuthentifiedRequest extends express.Request {
  tokenInfos: ITokenInformations;
}

@provide(tokenCheckInterceptorKey)
export class TokenCheckInterceptor implements ExpressInterceptor {
  public async intercept(
    request: express.Request,
    _response: express.Response,
    next: () => Promise<InterceptorTransformObject>,
  ): Promise<void> {
    console.log("TokenCheckInterceptor: intercept()");
    console.log(
      "request.headers.authorization : ",
      request.headers.authorization,
    );
    if (!request.headers.authorization) {
      throw new UnauthorizedError();
    }
    const tokenService = container.get<ITokenService>(tokenServiceKey);
    const tokenInfos = tokenService.validateToken(
      request.headers.authorization,
    );
    if (tokenInfos) {
      (request as IAuthentifiedRequest).tokenInfos = tokenInfos;
      next();
    }
  }
}

export function checkToken() {
  console.log("CheckToken() called.");
  return UseInterceptor(tokenCheckInterceptorKey);
}
