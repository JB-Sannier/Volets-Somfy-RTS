import type * as express from "express";
import {
  type AppError,
  CannotDeleteLightError,
  CannotUpdateLightError,
  LightNotFoundError,
  LightAlreadyExistsError,
  LightProxyServiceError,
  UnauthorizedError,
  ErrorCodes,
} from "../models/app-error";
import { ValidationError } from "yup";
import { CatchError, type ErrorFilter } from "@inversifyjs/http-core";
import type { Newable } from "inversify";

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
    response.status(error.getHttpResponseCode()).json({
      errorCode: error.errorCode,
      description: error.description,
      payload: error.payload,
    });
  }
}

@CatchError(LightAlreadyExistsError)
export class LightAlreadyExistsErrorFilter extends AppErrorFilter {}

@CatchError(LightNotFoundError)
export class LightNotFoundErrorFilter extends AppErrorFilter {}

@CatchError(LightProxyServiceError)
export class LightProxyServiceErrorFilter extends AppErrorFilter {}

@CatchError(UnauthorizedError)
export class UnauthorizedErrorFilter extends AppErrorFilter {}

@CatchError(CannotDeleteLightError)
export class CannotDeleteLightErrorFilter extends AppErrorFilter {}

@CatchError(CannotUpdateLightError)
export class CannotUpdateLightErrorFilter extends AppErrorFilter {}

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
  LightAlreadyExistsErrorFilter,
  LightNotFoundErrorFilter,
  LightProxyServiceErrorFilter,
  CannotDeleteLightErrorFilter,
  CannotUpdateLightErrorFilter,
  UnauthorizedErrorFilter,
  FinalErrorFilter,
];
