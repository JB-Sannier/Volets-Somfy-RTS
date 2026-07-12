import { ILight, ILightWithoutId, ILightId } from "../models/light";

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
