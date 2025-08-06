import { Column, Entity } from "typeorm";
import { IShutter } from "../models/shutter";

@Entity({ name: "Shutter" })
export class ShutterEntity {
  @Column({ name: "shutterId", type: "character varying", primary: true })
  shutterId: string;

  @Column({ name: "shutterName", type: "character varying" })
  shutterName: string;

  @Column({ name: "proxyShutterId", type: "character varying" })
  proxyShutterId: string;

  constructor() {
    this.shutterId = "";
    this.shutterName = "";
    this.proxyShutterId = "";
  }

  toShutter(): IShutter {
    return {
      shutterId: this.shutterId,
      shutterName: this.shutterName,
      proxyShutterId: this.proxyShutterId,
    };
  }
}
