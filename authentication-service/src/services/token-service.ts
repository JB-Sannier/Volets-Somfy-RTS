import { provide } from "inversify-binding-decorators";
import { IUser, UserRole } from "../models/models";
import { UnauthorizedError } from "../models/app-error";
import generatePassword from "password-generator";
import * as jswonwebtoken from "jsonwebtoken";

export const tokenServiceKey = "TokenService";

export interface ITokenInformations {
  email: string;
  roles: UserRole[];
  expires: number;
}

export interface ITokenService {
  validateToken(token: string): ITokenInformations;
  createToken(user: IUser): Promise<string>;
}

@provide(tokenServiceKey)
export class TokenService implements ITokenService {
  private static signingKey: string = generatePassword(40, false);

  async createToken(user: IUser): Promise<string> {
    if (!user.isActive) {
      throw new UnauthorizedError();
    }
    const tokenInfos: ITokenInformations = {
      email: user.email,
      roles: user.roles,
      expires: Math.round(Date.now() / 1000.0 + 3600),
    };
    const token = jswonwebtoken.sign(tokenInfos, TokenService.signingKey, {
      expiresIn: "1h",
    });
    return token;
  }

  public validateToken(token: string): ITokenInformations {
    if (!token) {
      throw new UnauthorizedError();
    }
    try {
      if (token.startsWith("Bearer ")) {
        token = token.replace("Bearer ", "");
      }
      const decodedToken = jswonwebtoken.verify(
        token,
        TokenService.signingKey,
        {
          complete: true,
        },
      );
      let payload: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
      if (typeof decodedToken.payload === "string") {
        payload = JSON.parse(decodedToken.payload);
      } else {
        payload = decodedToken.payload;
      }
      const tokenInfos: ITokenInformations = {
        email: payload.email,
        expires: payload.exp,
        roles: payload.roles,
      };
      return tokenInfos;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedError();
    }
  }
}
