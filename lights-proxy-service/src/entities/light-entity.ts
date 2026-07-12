import { Column, Entity } from "typeorm";
import { type ILight, LightFrequencies, LightTypes } from "../models/light";

@Entity({ name: "Light" })
export class LightEntity {
  @Column({ name: "lightId", type: "character varying", primary: true })
  lightId: string;

  @Column({ name: "lightName", type: "character varying" })
  lightName: string;

  @Column({ name: "description", type: "character varying", nullable: true })
  description: string;

  @Column({ name: "type", type: "character varying", nullable: true })
  type: LightTypes;

  @Column({ name: "switchOnCode", type: "integer" })
  switchOnCode: number;

  @Column({ name: "switchOffCode", type: "integer" })
  switchOffCode: number;

  @Column({ name: "pulseLength", type: "integer" })
  pulseLength: number;

  @Column({ name: "protocol", type: "integer" })
  protocol: number;

  @Column({ name: "frequency", type: "integer" })
  frequency: LightFrequencies;

  constructor(light?: ILight) {
    if (light) {
      this.lightId = light.lightId;
      this.lightName = light.lightName;
      this.description = light.description;
      this.type = light.type;
      this.switchOnCode = light.switchOnCode;
      this.switchOffCode = light.switchOffCode;
      this.pulseLength = light.pulseLength;
      this.protocol = light.protocol;
      this.frequency = light.frequency;
    } else {
      this.lightId = "";
      this.lightName = "";
      this.description = "";
      this.type = LightTypes.TYPE_SWITCH;
      this.switchOnCode = 0;
      this.switchOffCode = 0;
      this.pulseLength = 0;
      this.protocol = 0;
      this.frequency = LightFrequencies.FREQ_433;
    }
  }

  toLight(): ILight {
    return {
      lightId: this.lightId,
      lightName: this.lightName,
      description: this.description,
      type: this.type,
      switchOnCode: this.switchOnCode,
      switchOffCode: this.switchOffCode,
      pulseLength: this.pulseLength,
      protocol: this.protocol,
      frequency: this.frequency,
    };
  }
}
