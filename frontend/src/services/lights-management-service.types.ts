export enum LightFrequencies {
	FREQ_315 = 315,
	FREQ_433 = 433,
	FREQ_868 = 868,
}

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
	switchOffCode: number;
	pulseLength: number;
	protocol: number;
	frequency: LightFrequencies;
}

export interface ILightId {
	lightId: string;
}

export type ILightWithoutId = Omit<ILight, "lightId">;

export type ISwitchLightRequest = ILightId;

export type IAddLightRequest = ILightWithoutId;

export type IUpdateLightRequest = ILight;

export type IDeleteLightRequest = ILightId;

export type IGetLightRequest = ILightId;

export interface IImportLightsRequest {
	lights: ILight[];
}

export const OK_RESPONSE = {
	status: "ok",
};

export const EMPTY_LIGHT: ILight = {
	lightId: "",
	lightName: "",
	description: "",
	type: LightTypes.TYPE_SWITCH,
	switchOnCode: 0,
	switchOffCode: 0,
	pulseLength: 0,
	protocol: 0,
	frequency: LightFrequencies.FREQ_433,
};
