export enum ErrorCodes {
  ValidationError = "INVALID_REQUEST",
  CannotModifyUser = "CANNOT_MODIFY_USER",
  CannotDeleteUser = "CANNOT_DELETE_USER",
  UserNotFound = "USER_NOT_FOUND",
  UserAlreadyExists = "USER_ALREADY_EXISTS",
  Unauthorized = "UNAUTHORIZED",
  MalformedRequest = "MALFORMED_REQUEST",
  ShutterNotFound = "SHUTTER_NOT_FOUND",
  ShutterAlreadyExists = "SHUTTER_ALREADY_EXISTS",
  SomfyProxyServiceError = "SOMFY_PROXY_SERVICE_ERROR",
  InternalServerError = "INTERNAL_SERVER_ERROR",
}

export enum ErrorDescriptions {
  CannotModifyUser = "Cannot modify user",
  CannotDeleteUser = "Cannot delete user",
  UserNotFound = "User not found",
  UserAlreadyExists = "User already exists",
  Unauthorized = "You are not authorized to access this resource",
  MalformedRequest = "Malformed request",
  ShutterNotFound = "Shutter not found",
  ShutterAlreadyExists = "Shutter already exists",
  SomfyProxyServiceError = "An error occured when contacting proxy.",
  InternalServerError = "Internal server error.",
}

export abstract class AppError extends Error {
  public errorCode: ErrorCodes;
  public description: ErrorDescriptions;
  public payload?: object;

  public abstract getHttpResponse(): number;

  constructor(
    errorCode: ErrorCodes,
    description: ErrorDescriptions,
    payload?: object,
  ) {
    super(description);
    this.errorCode = errorCode;
    this.description = description;
    this.payload = payload;
  }
}

export class UserNotFoundError extends AppError {
  constructor(email: string) {
    super(ErrorCodes.UserNotFound, ErrorDescriptions.UserNotFound, { email });
  }

  public getHttpResponse(): number {
    return 404;
  }
}

export class UserAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(ErrorCodes.UserAlreadyExists, ErrorDescriptions.UserAlreadyExists, {
      email,
    });
  }

  public getHttpResponse(): number {
    return 400;
  }
}

export class CannotAddUserError extends AppError {
  constructor(email: string) {
    super(ErrorCodes.CannotModifyUser, ErrorDescriptions.CannotModifyUser, {
      email,
    });
  }

  public getHttpResponse(): number {
    return 400;
  }
}

export class CannotModifyUserError extends AppError {
  constructor(email: string) {
    super(ErrorCodes.CannotModifyUser, ErrorDescriptions.CannotModifyUser, {
      email,
    });
  }

  public getHttpResponse(): number {
    return 400;
  }
}

export class CannotDeleteUserError extends AppError {
  constructor(email: string) {
    super(ErrorCodes.CannotDeleteUser, ErrorDescriptions.CannotDeleteUser, {
      email,
    });
  }
  public getHttpResponse(): number {
    return 400;
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super(ErrorCodes.Unauthorized, ErrorDescriptions.Unauthorized, {});
  }
  public getHttpResponse(): number {
    return 403;
  }
}

export class MalformedRequestError extends AppError {
  constructor(payload?: object) {
    super(
      ErrorCodes.MalformedRequest,
      ErrorDescriptions.MalformedRequest,
      payload,
    );
  }
  public getHttpResponse(): number {
    return 400;
  }
}

export class InternalServerError extends AppError {
  constructor(payload?: object) {
    super(
      ErrorCodes.InternalServerError,
      ErrorDescriptions.InternalServerError,
      payload,
    );
  }
  public getHttpResponse(): number {
    return 500;
  }
}

export class SomfyProxyError extends AppError {
  constructor(payload?: object) {
    super(
      ErrorCodes.SomfyProxyServiceError,
      ErrorDescriptions.SomfyProxyServiceError,
      payload,
    );
  }
  public getHttpResponse(): number {
    return 500;
  }
}

export class ShutterNotFoundError extends AppError {
  constructor(payload: object) {
    super(
      ErrorCodes.ShutterNotFound,
      ErrorDescriptions.ShutterNotFound,
      payload,
    );
  }
  public getHttpResponse(): number {
    return 404;
  }
}

export function createErrorFromErrorCode(
  code: ErrorCodes,
  description?: string,
  payload?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  switch (code) {
    case ErrorCodes.CannotDeleteUser:
      return new CannotDeleteUserError(payload!.email || "");
    case ErrorCodes.CannotModifyUser:
      return new CannotModifyUserError(payload!.email || "");
    case ErrorCodes.MalformedRequest:
      return new MalformedRequestError(payload);
    case ErrorCodes.ShutterAlreadyExists:
    case ErrorCodes.ShutterNotFound:
    case ErrorCodes.Unauthorized:
      return new UnauthorizedError();
    case ErrorCodes.UserAlreadyExists:
      return new UserAlreadyExistsError(payload!.email || "");
    case ErrorCodes.SomfyProxyServiceError:
      return new InternalServerError();
    case ErrorCodes.InternalServerError:
      return new InternalServerError();
    case ErrorCodes.ValidationError:
      return new MalformedRequestError(payload);
    case ErrorCodes.UserNotFound:
      return new UserNotFoundError(payload!.email || "");
  }
}
