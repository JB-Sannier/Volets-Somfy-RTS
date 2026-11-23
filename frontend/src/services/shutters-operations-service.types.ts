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
