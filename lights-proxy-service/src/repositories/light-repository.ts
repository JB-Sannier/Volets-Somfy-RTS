import { inject } from "inversify";
import { provide } from "@inversifyjs/binding-decorators";

import type { ILight, ILightWithoutId } from "../models/light";

import {
  type ISqlConnectionService,
  sqlConnectionServiceKey,
} from "../services/sql-connection-service";
import { v4 as uuid } from "uuid";
import { LightEntity } from "../entities/light-entity";

export const lightsRepositoryKey = Symbol.for("LightsRepository");

export interface ILightRepository {
  addLight(light: ILightWithoutId): Promise<ILight>;
  getLight(lightId: string): Promise<ILight | undefined>;
  modifyLight(light: ILight): Promise<boolean>;
  deleteLight(light: ILight): Promise<boolean>;
  listLights(): Promise<ILight[]>;
  importLight(light: ILight): Promise<boolean>;
}

@provide(lightsRepositoryKey)
export class LightRepository implements ILightRepository {
  constructor(
    @inject(sqlConnectionServiceKey)
    private readonly sqlConnectionService: ISqlConnectionService,
  ) {}

  async addLight(light: ILightWithoutId): Promise<ILight> {
    const lightId = `light:${uuid()}`;
    const lightEntity = new LightEntity({ ...light, lightId });
    const dataSource = await this.sqlConnectionService.getConnection();
    await dataSource.manager.transaction(async (manager) => {
      await manager.save(lightEntity);
    });
    return lightEntity.toLight();
  }

  async getLight(lightId: string): Promise<ILight | undefined> {
    const dataSource = await this.sqlConnectionService.getConnection();
    const lightEntity = await dataSource.manager.findOne(LightEntity, {
      where: { lightId },
    });
    return lightEntity?.toLight();
  }

  async modifyLight(light: ILight): Promise<boolean> {
    const dataSource = await this.sqlConnectionService.getConnection();
    const lightEntity = new LightEntity(light);
    const result = await dataSource.manager.update(
      LightEntity,
      { lightId: light.lightId },
      lightEntity,
    );
    return result.affected !== undefined && result.affected > 0;
  }

  async deleteLight(light: ILight): Promise<boolean> {
    const dataSource = await this.sqlConnectionService.getConnection();
    const result = await dataSource.manager.delete(LightEntity, {
      lightId: light.lightId,
    });
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }

  async listLights(): Promise<ILight[]> {
    const dataSource = await this.sqlConnectionService.getConnection();
    const lightEntities = await dataSource.manager.find(LightEntity);
    return lightEntities.map((entity) => entity.toLight());
  }

  async importLight(light: ILight): Promise<boolean> {
    const dataSource = await this.sqlConnectionService.getConnection();
    const lightEntity = new LightEntity(light);
    try {
      await dataSource.manager.save(lightEntity);
      return true;
    } catch (error) {
      console.error("Error importing light:", error);
      return false;
    }
  }
}
