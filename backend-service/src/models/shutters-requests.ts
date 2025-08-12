/* Used in somfy-shutters-controller */
export interface IAddShutterRequest {
  shutterName: string;
}

export interface IGetShutterRequest {
  shutterId: string;
}

export interface IModifyShutterRequest {
  shutterId: string;
  shutterName: string;
}

export interface IDeleteShutterRequest {
  shutterId: string;
}

export interface IShutterResponse {
  shutterId: string;
  shutterName: string;
}

export type IAddShutterResponse = IShutterResponse;
export type IGetShutterResponse = IShutterResponse;
export type IModifyShutterResponse = IShutterResponse;
export type IDeleteShutterResponse = IShutterResponse;

export type IListShuttersResponse = IShutterResponse[];

/* Used in somfy-operate-controller */

export interface IBaseShutterCommand {
  shutterId: string;
}

export type IRaiseShutterRequest = IBaseShutterCommand;
export type ILowerShutterRequest = IBaseShutterCommand;
export type IStopShutterRequest = IBaseShutterCommand;
export type IProgramShutterRequest = IBaseShutterCommand;

export type IBaseShutterResponse = {
  status: "Ok";
};
export type IRaiseShutterResponse = IBaseShutterResponse;
export type ILowerShutterResponse = IBaseShutterResponse;
export type IStopShutterResponse = IBaseShutterResponse;
export type IProgramShutterResponse = IBaseShutterResponse;
