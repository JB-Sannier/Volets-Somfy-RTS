export enum ErrorCodes {
  ValidationError = "INVALID_REQUEST",
  CannotModifyUser = "CANNOT_MODIFY_USER",
  CannotDeleteUser = "CANNOT_DELETE_USER",
  UserNotFound = "USER_NOT_FOUND",
  UserAlreadyExists = "USER_ALREADY_EXISTS",
  Unauthorized = "UNAUTHORIZED",
}

export enum ErrorDescriptions {
  CannotModifyUser = "Cannot modify user",
  CannotDeleteUser = "Cannot delete user",
  UserNotFound = "User not found",
  UserAlreadyExists = "User already exists",
  Unauthorized = "You are not authorized to access this resource",
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
