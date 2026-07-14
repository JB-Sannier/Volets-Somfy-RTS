export enum LightFrequencies {
  FREQ_315 = 315,
  FREQ_433 = 433,
  FREQ_868 = 868,
}

// Some light controllers have only one button, to switch on/off.
// Some other have two buttons, one to switch on and one to switch off.
// The type of the light is used to know how to send the command to the light.
export enum LightTypes {
  TYPE_SWITCH = "switch",
  TYPE_TWO_BUTTONS = "two-buttons",
}

export interface ILight {
  lightId: string;
  lightName: string;
  description: string;
  type: LightTypes;
  switchOnCode: number;
  switchOffCode: number; // if (type===TYPE_SWITCH), switchOffCode is not used.
  pulseLength: number;
  protocol: number;
  frequency: LightFrequencies;
}

export interface ILightId {
  lightId: string;
}

export type ILightWithoutId = Omit<ILight, "lightId">;
