import { Interceptor, InterceptorTransformObject, UseInterceptor } from "@inversifyjs/http-core";
import * as express from "express";
import { UserRole } from "../models/models";
import { UnauthorizedError } from "../models/app-error";
import { ITokenService, tokenServiceKey } from "../services/token-service";
import { container } from "../ioc/container";
import { provide } from "@inversifyjs/binding-decorators";

export const checkUserManagerRoleKey = Symbol.for('CheckUserManagerRole');
export const checkShutterManagerRoleKey = Symbol.for('CheckShutterManagerRole');

async function interceptRole(role: UserRole, req: express.Request, res: express.Response, next: () => Promise<InterceptorTransformObject>): Promise<void> {
  if (!req.headers.authorization) {
    throw new UnauthorizedError();
  }
  const tokenService = container.get<ITokenService>(tokenServiceKey);
  const tokenInfos = tokenService.validateToken(req.headers.authorization);
  if (!tokenInfos.roles.find((r) => r === role)) {
    throw new UnauthorizedError();
  }
  await next();
}

@provide(checkUserManagerRoleKey)
export class CheckUserManagerRole implements Interceptor {
  async intercept(req: express.Request, res: express.Response, next: () => Promise<InterceptorTransformObject>): Promise<void> {
    return interceptRole(UserRole.UserManager, req, res, next);
  }
}

@provide(checkShutterManagerRoleKey)
export class CheckShutterManagerRole implements Interceptor {
  async intercept(req: express.Request, res: express.Response, next: () => Promise<InterceptorTransformObject>): Promise<void> {
    return interceptRole(UserRole.ShuttersProgrammer, req, res, next);
  }
}

export function checkUserRole(role: UserRole): ClassDecorator & MethodDecorator {
  if (role === UserRole.ShuttersProgrammer) {
    return UseInterceptor(checkShutterManagerRoleKey);
  } else if (role === UserRole.UserManager) {
    return UseInterceptor(checkUserManagerRoleKey);
  } else {
    throw new UnauthorizedError();
  }
}

