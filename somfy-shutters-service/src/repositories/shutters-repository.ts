import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { IShutterResponse } from "../requests/requests";
import { IShutter, toShutterEntity } from "../models/shutter";
import {
  ISqlConnectionService,
  sqlConnectionServiceKey,
} from "../services/sql-connection-service";
import { v4 as uuid } from "uuid";
import { ShutterEntity } from "../entities/shutter-entity";

export const shuttersRepositoryKey = Symbol.for("ShuttersRepository");

export interface IShutterRepository {
  addShutter(
    shutterName: string,
    proxyShutterId: string,
  ): Promise<IShutterResponse>;
  getShutter(shutterId: string): Promise<IShutter | undefined>;
  modifyShutter(shutter: IShutter): Promise<boolean>;
  deleteShutter(shutter: IShutter): Promise<boolean>;
  listShutters(): Promise<IShutter[]>;
}

@provide(shuttersRepositoryKey)
export class ShutterRepository implements IShutterRepository {
  constructor(
    @inject(sqlConnectionServiceKey)
    private readonly sqlConnectionService: ISqlConnectionService,
  ) {}

  async addShutter(
    shutterName: string,
    proxyShutterId: string,
  ): Promise<IShutterResponse> {
    const shutterId = `shutter:${uuid()}`;
    const shutterEntity = new ShutterEntity();
    shutterEntity.shutterId = shutterId;
    shutterEntity.shutterName = shutterName;
    shutterEntity.proxyShutterId = proxyShutterId;
    const dataSource = await this.sqlConnectionService.getConnection();
    await dataSource.manager.transaction(async (manager) => {
      await manager.save(shutterEntity);
    });
    return shutterEntity.toShutter();
  }

  async modifyShutter(shutter: IShutter): Promise<boolean> {
    const dataSource = await this.sqlConnectionService.getConnection();
    const shutterEntity = toShutterEntity(shutter);
    await dataSource.manager.transaction(async (manager) => {
      await manager.save(shutterEntity);
    });
    return true;
  }

  async deleteShutter(shutter: IShutter): Promise<boolean> {
    const dataSource = await this.sqlConnectionService.getConnection();
    const shutterEntity = toShutterEntity(shutter);
    await dataSource.manager.transaction(async (manager) => {
      await manager.remove(shutterEntity);
    });
    return true;
  }

  async getShutter(shutterId: string): Promise<IShutter | undefined> {
    const dataSource = await this.sqlConnectionService.getConnection();
    const result = await dataSource.manager.findOne(ShutterEntity, {
      where: {
        shutterId,
      },
    });
    if (result) {
      return result.toShutter();
    }
    return undefined;
  }

  async listShutters(): Promise<IShutter[]> {
    const dataSource = await this.sqlConnectionService.getConnection();
    const result = await dataSource.manager.find(ShutterEntity);
    return result.map((r) => r.toShutter());
  }
}
