import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import { IRefreshToken } from "../models/models";
import {
  IRefreshTokenRepository,
  refreshTokenRepositoryKey,
} from "../repositories/refresh-token-repository";
import * as jsonwebtoken from "jsonwebtoken";
import { appConfigServiceKey, IAppConfigService } from "./app-config-service";
import { UnauthorizedError } from "../models/app-error";
import { ITokenService, tokenServiceKey } from "./token-service";
import {
  IUserRepository,
  userRepositoryKey,
} from "../repositories/user-repository";
import {
  IRefreshTokenRequest,
  IRefreshTokenResponse,
} from "../models/requests";

export interface IRefreshTokenService {
  refreshToken(request: IRefreshTokenRequest): Promise<IRefreshTokenResponse>;
  invalidateRefreshTokens(email: string): Promise<void>;
  createRefreshToken(email: string): Promise<IRefreshToken>;
}

export const refreshTokenServiceKey = Symbol.for("RefreshTokenService");

@provide(refreshTokenServiceKey)
export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    @inject(refreshTokenRepositoryKey)
    private readonly repository: IRefreshTokenRepository,
    @inject(appConfigServiceKey) private readonly appConfig: IAppConfigService,
    @inject(tokenServiceKey) private readonly tokenService: ITokenService,
    @inject(userRepositoryKey) private readonly userRepository: IUserRepository,
  ) {}

  async refreshToken(
    request: IRefreshTokenRequest,
  ): Promise<IRefreshTokenResponse> {
    const signingKey = this.appConfig.refreshTokenSigningKey();
    let email: string = "";
    try {
      const decodedToken = jsonwebtoken.verify(
        request.refreshToken,
        signingKey,
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
      email = payload.email;
    } catch (error) {
      console.error(
        "RefreshTokenService: refreshToken() : error while decoding token : ",
        { request, error },
      );
      throw new UnauthorizedError();
    }
    const foundToken = await this.repository.findRefreshToken(
      email,
      request.refreshToken,
    );
    if (!foundToken) {
      console.error(
        "RefreshTokenService: refreshToken(): error while searching the RefreshToken for : ",
        { email, request },
      );
      throw new UnauthorizedError();
    }
    if (foundToken.expiration < Date.now()) {
      console.error("RefreshTokenService: refreshToken: token expired : ", {
        email,
        foundToken,
      });
      throw new UnauthorizedError();
    }
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError();
    }
    const accessToken = await this.tokenService.createToken(user);
    return {
      token: accessToken,
      refreshToken: request.refreshToken,
    };
  }

  async invalidateRefreshTokens(email: string): Promise<void> {
    await this.repository.invalidateRefreshTokens(email);
  }

  async createRefreshToken(email: string): Promise<IRefreshToken> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user || !user.isActive) {
      throw new UnauthorizedError();
    }

    const signingKey = this.appConfig.refreshTokenSigningKey();
    const expiration = Date.now() + 1000 * 60 * 60 * 24 * 7 * 5;
    const expirationDate = new Date(expiration);

    const token = jsonwebtoken.sign({ email }, signingKey, { expiresIn: "5w" });
    await this.repository.storeRefreshToken(email, token, expirationDate);
    return {
      email,
      expiration,
      token,
    };
  }
}
