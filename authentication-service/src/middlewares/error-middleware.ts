import * as express from "express";
import {
  AppError,
  UserNotFoundError,
  CannotAddUserError,
  CannotDeleteUserError,
  CannotModifyUserError,
  UnauthorizedError,
  UserAlreadyExistsError,
  ErrorCodes,
} from "../models/app-error";
import { ValidationError } from "yup";
import { CatchError, ErrorFilter } from "@inversifyjs/http-core";
import { Newable } from "inversify";

@CatchError(ValidationError) // ValidationError)
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
  catch(error: AppError, _request: express.Request, response: express.Response) {
    console.log('AppErrorFilter : got Error : ', error);

    /*
    throw new UnprocessableEntityHttpResponse({
      errorCode: error.errorCode,
      description: error.description,
    }, error.description, undefined);
    */

    response.status(error.getHttpResponse()).send({
      errorCode: error.errorCode,
      description: error.description,
    });

  }
}

@CatchError(UserNotFoundError)
export class UserNotFoundErrorFilter extends AppErrorFilter { }

@CatchError(CannotAddUserError)
export class CannotAddUserErrorFilter extends AppErrorFilter { }

@CatchError(CannotDeleteUserError)
export class CannotDeleteUserErrorFilter extends AppErrorFilter { }

@CatchError(CannotModifyUserError)
export class CannotModifyUserErrorFilter extends AppErrorFilter { }

@CatchError(UnauthorizedError)
export class UnauthorizedErrorFilter extends AppErrorFilter { }

@CatchError(UserAlreadyExistsError)
export class UserAlreadyExistsErrorFilter extends AppErrorFilter { }

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
  UserNotFoundErrorFilter,
  CannotAddUserErrorFilter,
  CannotDeleteUserErrorFilter,
  CannotModifyUserErrorFilter,
  UnauthorizedErrorFilter,
  UserAlreadyExistsErrorFilter,
  FinalErrorFilter,
];
