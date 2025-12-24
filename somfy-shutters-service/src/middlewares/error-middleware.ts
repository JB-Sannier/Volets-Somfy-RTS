import * as express from "express";
import {
  AppError,
  ShutterAlreadyExistsError,
  ShutterNotFoundError,
  SomfyProxyServiceError,
  UnauthorizedError,
  ErrorCodes,
} from "../models/app-error";
import { ValidationError } from "yup";
import { CatchError, ErrorFilter } from "@inversifyjs/http-core";
import { Newable } from "inversify";

@CatchError(ValidationError)
export class ValidationErrorFilter implements ErrorFilter<ValidationError> {
  catch(
    error: ValidationError,
    request: express.Request,
    response: express.Response,
  ) {
    response.status(400).json({
      errorCode: ErrorCodes.ValidationError,
      description: error.message,
      payload: error.errors,
    });
  }
}

export class AppErrorFilter implements ErrorFilter<AppError> {
  catch(
    error: AppError,
    _request: express.Request,
    response: express.Response,
  ) {
    response.status(error.getHttpResponseCode()).send({
      errorCode: error.errorCode,
      description: error.description,
    });
  }
}

@CatchError(ShutterAlreadyExistsError)
export class ShutterAlreadyExistsErrorFilter extends AppErrorFilter {}

@CatchError(ShutterNotFoundError)
export class ShutterNotFoundErrorFilter extends AppErrorFilter {}

@CatchError(SomfyProxyServiceError)
export class SomfyProxyServiceErrorFilter extends AppErrorFilter {}

@CatchError(UnauthorizedError)
export class UnauthorizedErrorFilter extends AppErrorFilter {}

@CatchError()
export class FinalErrorFilter extends AppErrorFilter {
  catch(error: unknown, request: express.Request, response: express.Response) {
    console.error("Unhandled error : ", error);
    response.status(500).json({
      errorCode: "INTERNAL_SERVER_ERROR",
      description: "Internal Server Error",
    });
  }
}

export const errorFilterList: Newable<ErrorFilter>[] = [
  ValidationErrorFilter,
  ShutterAlreadyExistsErrorFilter,
  ShutterNotFoundErrorFilter,
  SomfyProxyServiceErrorFilter,
  UnauthorizedErrorFilter,
  FinalErrorFilter,
];
