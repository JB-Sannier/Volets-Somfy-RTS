import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import { RefreshTokenEntity } from "../entities/refresh-token";
import {
  ISqlConnectionService,
  sqlConnectionServiceKey,
} from "../services/sql-connection-service";
import { IRefreshToken } from "../models/models";

export interface IRefreshTokenRepository {
  hasRefreshToken(email: string, refreshToken: string): Promise<boolean>;
  storeRefreshToken(
    email: string,
    refreshToken: string,
    expiration: Date,
  ): Promise<void>;
  invalidateRefreshTokens(email: string): Promise<void>;
  findRefreshToken(
    email: string,
    refreshToken: string,
  ): Promise<IRefreshToken | undefined>;
}

export const refreshTokenRepositoryKey = "RefreshTokenRepositoryKey";

@provide(refreshTokenRepositoryKey)
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @inject(sqlConnectionServiceKey)
    private readonly sqlConnectionService: ISqlConnectionService,
  ) {}

  async hasRefreshToken(email: string, refreshToken: string): Promise<boolean> {
    const connection = await this.sqlConnectionService.getConnection();
    const result = await connection.manager.findOne(RefreshTokenEntity, {
      where: {
        email,
        refreshToken,
      },
    });
    return result !== undefined;
  }

  async storeRefreshToken(
    email: string,
    refreshToken: string,
    expiration: Date,
  ): Promise<void> {
    const connection = await this.sqlConnectionService.getConnection();
    const entity = new RefreshTokenEntity();
    entity.email = email;
    entity.refreshToken = refreshToken;
    entity.expiration = expiration;

    connection.manager.transaction(async (manager) => {
      await manager.save(entity);
    });
  }

  async invalidateRefreshTokens(email: string): Promise<void> {
    const connection = await this.sqlConnectionService.getConnection();
    connection.manager.transaction(async (manager) => {
      const tokenEntitiesForUser = await manager.find(RefreshTokenEntity, {
        where: {
          email,
        },
      });
      await manager.delete(RefreshTokenEntity, tokenEntitiesForUser);
    });
  }

  async findRefreshToken(
    email: string,
    refreshToken: string,
  ): Promise<IRefreshToken | undefined> {
    const connection = await this.sqlConnectionService.getConnection();
    const result = await connection.manager.findOne(RefreshTokenEntity, {
      where: {
        email,
        refreshToken,
      },
    });
    if (!result) {
      return undefined;
    }
    return {
      email: result.email,
      expiration: result.expiration.getTime(),
      token: result.refreshToken,
    };
  }
}
