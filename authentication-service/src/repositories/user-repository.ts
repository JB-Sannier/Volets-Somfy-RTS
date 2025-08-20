import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import { UserEntity } from "../entities/user";
import {
  IUser,
  IUserResponse,
  toUser,
  toUserResponse,
  UserRole,
} from "../models/models";
import {
  ISqlConnectionService,
  sqlConnectionServiceKey,
} from "../services/sql-connection-service";
import { ArrayContains } from "typeorm";

export const userRepositoryKey = "UserRepository";

export interface IUserRepository {
  getUserByEmail(email: string): Promise<IUser | undefined>;
  getAdminUsersCount(): Promise<number>;
  addUser(user: IUser): Promise<boolean>;
  modifyUser(user: IUser): Promise<boolean>;
  deleteUser(email: string): Promise<boolean>;
  listUsers(): Promise<IUserResponse[]>;
}

@provide(userRepositoryKey)
export class UserRepository implements IUserRepository {
  constructor(
    @inject(sqlConnectionServiceKey)
    private readonly connectionService: ISqlConnectionService,
  ) {}

  async getUserByEmail(email: string): Promise<IUser | undefined> {
    const dataSource = await this.connectionService.getConnection();
    const result = await dataSource.manager.findOne(UserEntity, {
      where: {
        email,
      },
    });
    if (result) {
      return toUser(result);
    }
    return undefined;
  }

  async getAdminUsersCount(): Promise<number> {
    const dataSource = await this.connectionService.getConnection();
    const result = await dataSource.manager.count(UserEntity, {
      where: {
        roles: ArrayContains([UserRole.UserManager]),
        isActive: true,
      },
    });
    return result;
  }

  async modifyUser(user: IUser): Promise<boolean> {
    const dataSource = await this.connectionService.getConnection();
    await dataSource.manager.transaction(async (manager) => {
      const entity = new UserEntity();
      entity.email = user.email;
      entity.password = user.password;
      entity.isActive = user.isActive;
      entity.roles = user.roles;
      await manager.save<UserEntity>(entity);
    });
    return true;
  }

  async addUser(user: IUser): Promise<boolean> {
    const dataSource = await this.connectionService.getConnection();
    const manager = dataSource.manager;
    const entity = await dataSource.manager.findOne(UserEntity, {
      where: {
        email: user.email,
      },
    });
    if (entity) {
      return false;
    }
    const entityToSave = new UserEntity();
    entityToSave.email = user.email;
    entityToSave.roles = user.roles;
    entityToSave.password = user.password;
    entityToSave.isActive = user.isActive;
    await manager.transaction(async (manager) => {
      await manager.save(entityToSave);
    });

    return true;
  }

  async deleteUser(email: string): Promise<boolean> {
    const dataSource = await this.connectionService.getConnection();
    await dataSource.manager.transaction(async (manager) => {
      const entity = await manager.findOne(UserEntity, {
        where: {
          email,
        },
      });
      if (!entity) {
        return false;
      }
      await dataSource.manager.delete<UserEntity>(UserEntity, entity);
    });
    return true;
  }

  async listUsers(): Promise<IUserResponse[]> {
    const dataSource = await this.connectionService.getConnection();
    const result = await dataSource.manager.find(UserEntity);
    const response = result.map((r) => toUserResponse(r));
    return response;
  }
}
