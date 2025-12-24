import * as express from "express";
import { ValidationError } from "yup";
import {
  AppError,
  UserNotFoundError,
  CannotAddUserError,
  CannotDeleteUserError,
  CannotModifyUserError,
  UnauthorizedError,
  UserAlreadyExistsError,
  ErrorCodes,
  SomfyProxyError,
  ShutterNotFoundError,
} from "../models/app-error";
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
    response.status(error.getHttpResponse()).send({
      errorCode: error.errorCode,
      description: error.description,
    });
  }
}

@CatchError(CannotAddUserError)
export class CannotAddUserErrorFilter extends AppErrorFilter {}

@CatchError(CannotModifyUserError)
export class CannotModifyUserErrorFilter extends AppErrorFilter {}

@CatchError(CannotDeleteUserError)
export class CannotDeleteUserErrorFilter extends AppErrorFilter {}

@CatchError(UserNotFoundError)
export class UserNotFoundErrorFilter extends AppErrorFilter {}

@CatchError(UserAlreadyExistsError)
export class UserAlreadyExistsErrorFilter extends AppErrorFilter {}

@CatchError(UnauthorizedError)
export class UnauthorizedErrorFilter extends AppErrorFilter {}

@CatchError(ShutterNotFoundError)
export class ShutterNotFoundErrorFilter extends AppErrorFilter {}

@CatchError(SomfyProxyError)
export class SomfyProxyErrorFilter extends AppErrorFilter {}

@CatchError(Error)
export class FinalErrorFilter implements ErrorFilter {
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
  CannotAddUserErrorFilter,
  CannotModifyUserErrorFilter,
  CannotDeleteUserErrorFilter,
  UserNotFoundErrorFilter,
  UserAlreadyExistsErrorFilter,
  UnauthorizedErrorFilter,
  ShutterNotFoundErrorFilter,
  SomfyProxyErrorFilter,
  FinalErrorFilter,
];
