import { provide } from "@inversifyjs/binding-decorators";
import { UserRole } from "../models/models";
import { UnauthorizedError } from "../models/app-error";
import { appConfigServiceKey, IAppConfigService } from "./app-config-service";
import { inject } from "inversify";
import axios, { isAxiosError } from "axios";

export const tokenServiceKey = "TokenService";

export interface ITokenInformations {
  email: string;
  roles: UserRole[];
}

export interface ITokenService {
  validateToken(token: string): Promise<ITokenInformations>;
}

@provide(tokenServiceKey)
export class TokenService implements ITokenService {
  constructor(
    @inject(appConfigServiceKey) private readonly appConfig: IAppConfigService,
  ) {}

  async validateToken(token: string): Promise<ITokenInformations> {
    if (!token) {
      throw new UnauthorizedError();
    }
    try {
      const baseUrl = this.appConfig.authenticationServiceURL();
      const path = "api/v1/auth/tokenInfos";
      const response = await axios.get<ITokenInformations>(
        `${baseUrl}/${path}`,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      const tokenInfos = response.data;
      return tokenInfos;
    } catch (error: unknown) {
      this.dumpError(error);
      throw new UnauthorizedError();
    }
  }

  private dumpError(error: unknown) {
    if (isAxiosError(error)) {
      console.error("Got axios error : ", {
        status: error.status,
        code: error.code,
        message: error.message,
        name: error.name,
      });
    } else {
      console.error("ValidateToken: got unhandled error : ", error);
    }
  }
}
