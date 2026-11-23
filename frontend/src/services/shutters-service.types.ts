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

export interface IShutter {
  shutterId: string;
  shutterName: string;
}

export type IAddShutterResponse = IShutter;
export type IGetShutterResponse = IShutter;
export type IModifyShutterResponse = IShutter;
export type IDeleteShutterResponse = IShutter;

export type IListShuttersResponse = IShutter[];
