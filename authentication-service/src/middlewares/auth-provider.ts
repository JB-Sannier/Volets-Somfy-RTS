import { injectable, inject } from "inversify";
import { interfaces } from "inversify-express-utils";
import * as express from "express";
import { ITokenService, tokenServiceKey } from "../services/token-service";
import { IUser } from "../models/models";
import { UserNotFoundError } from "../models/app-error";
import { container } from "../ioc/container";
import { IUserService, userServiceKey } from "../services/user-service";

export class Principal implements interfaces.Principal<IUser | undefined> {
  public details: IUser | undefined;
  public constructor(details: IUser | undefined) {
    this.details = details;
  }
  async isAuthenticated(): Promise<boolean> {
    return this.details !== undefined;
  }

  async isResourceOwner(resourceId: unknown): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }
    console.log("Principal : isResourceOwner : ", {
      resourceId,
      details: this.details,
    });
    return resourceId === 1111;
  }
  async isInRole(role: string): Promise<boolean> {
    if (!this.details) {
      return false;
    }
    console.log("Principal: isInRole : ", { role, details: this.details });
    return this.details.roles.find((r) => r === role) !== undefined;
  }
}

@injectable()
export class CustomAuthProvider implements interfaces.AuthProvider {
  @inject(tokenServiceKey) private readonly tokenService: ITokenService;
  @inject(userServiceKey) private readonly userService: IUserService;
  constructor() {
    this.tokenService = container.get<ITokenService>(tokenServiceKey);
    this.userService = container.get<IUserService>(userServiceKey);
  }

  public async getUser(
    req: express.Request,
    res: express.Response, // eslint-disable-line @typescript-eslint/no-unused-vars
    next: express.NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<interfaces.Principal> {
    const token = req.headers["authorization"] as string;
    try {
      const tokenInformations = this.tokenService.validateToken(token);
      const user = await this.userService.getUser(tokenInformations.email);
      if (!user) {
        throw new UserNotFoundError(tokenInformations.email);
      }
      if (!user.isActive) {
        throw new UserNotFoundError(tokenInformations.email);
      }
      return new Principal(user);
    } catch (error) {
      console.error(
        "CustomAuthProvider: getUser: some error happened : ",
        error,
      );
      return new Principal(undefined);
    }
  }
}
