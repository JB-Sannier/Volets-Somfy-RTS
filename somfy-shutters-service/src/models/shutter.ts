import { ShutterEntity } from "../entities/shutter-entity";

export interface IShutter {
  shutterId: string;
  shutterName: string;
  proxyShutterId: string;
}

export function toShutterEntity(shutter: IShutter) {
  const shutterEntity = new ShutterEntity();
  shutterEntity.proxyShutterId = shutter.proxyShutterId;
  shutterEntity.shutterId = shutter.shutterId;
  shutterEntity.shutterName = shutter.shutterName;
  return shutterEntity;
}
