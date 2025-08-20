import * as express from "express";
import { AppError, ErrorCodes } from "../models/app-error";
import { ValidationError } from "yup";

export function errorHandler(
  err: unknown,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  console.log("Error handler : ", err);

  if (err instanceof AppError) {
    const payload = {
      errorCode: err.errorCode,
      description: err.description,
      payload: err.payload,
    };
    switch (err.errorCode) {
      case ErrorCodes.SomfyProxyServiceError:
        res.status(500).json(payload);
        return;
      case ErrorCodes.CannotDeleteUser:
      case ErrorCodes.CannotModifyUser:
      case ErrorCodes.MalformedRequest:
      case ErrorCodes.UserAlreadyExists:
      case ErrorCodes.ShutterAlreadyExists:
        res.status(400).json(payload);
        return;
      case ErrorCodes.ShutterNotFound:
      case ErrorCodes.UserNotFound:
        res.status(404).json(payload);
        return;
      case ErrorCodes.Unauthorized:
        console.log("Sending back UnauthorizedError");
        res.status(401).json(payload);
        return;
      default:
        console.warn("AppError not handled : ", err);
        res.status(500).json({
          errorCode: "INTERNAL_SERVER_ERROR",
          description: "Internal Server Error",
        });
        return;
    }
  }
  if (err instanceof ValidationError) {
    res.status(400).json({
      errorCode: "INVALID_REQUEST",
      description: (err as ValidationError).message,
    });
    return;
  }

  console.warn("ErrorMiddleware : Unhandled error : ", err);

  res.status(500).json({
    errorCode: "INTERNAL_SERVER_ERROR",
    description: "Internal Server Error",
  });
}
