import { object, ObjectSchema, string } from "yup";
import {
  IAddShutterRequest,
  IBaseShutterCommand,
  IDeleteShutterRequest,
  IGetShutterRequest,
  ILowerShutterRequest,
  IModifyShutterRequest,
  IProgramShutterRequest,
  IRaiseShutterRequest,
  IStopShutterRequest,
} from "./shutters-requests";

/* Used in somfy-shutters-controller */

export const addShutterValidator: ObjectSchema<IAddShutterRequest> = object({
  shutterName: string().required(),
});

export const modifyShutterValidator: ObjectSchema<IModifyShutterRequest> =
  object({
    shutterId: string().required(),
    shutterName: string().required(),
  });

export const deleteShutterValidator: ObjectSchema<IDeleteShutterRequest> =
  object({
    shutterId: string().required(),
  });

export const getShutterValidator: ObjectSchema<IGetShutterRequest> = object({
  shutterId: string().required(),
});

/* used in somfy-operate-controller */

export const baseShutterCommand: ObjectSchema<IBaseShutterCommand> = object({
  shutterId: string().required(),
}).defined();

export const raiseShutterValidator: ObjectSchema<IRaiseShutterRequest> =
  baseShutterCommand;
export const lowerShutterValidator: ObjectSchema<ILowerShutterRequest> =
  baseShutterCommand;
export const stopShutterValidator: ObjectSchema<IStopShutterRequest> =
  baseShutterCommand;
export const programShutterValidator: ObjectSchema<IProgramShutterRequest> =
  baseShutterCommand;
