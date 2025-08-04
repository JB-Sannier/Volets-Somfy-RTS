export enum ErrorCodes {
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

export class AppError {
  public code: ErrorCodes;
  public description: ErrorDescriptions;
  public payload?: object;

  constructor(
    code: ErrorCodes,
    description: ErrorDescriptions,
    payload?: object,
  ) {
    this.code = code;
    this.description = description;
    this.payload = payload;
  }
}

export class UserNotFoundError extends AppError {
  constructor(email: string) {
    super(ErrorCodes.UserNotFound, ErrorDescriptions.UserNotFound, { email });
  }
}

export class UserAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(ErrorCodes.UserAlreadyExists, ErrorDescriptions.UserAlreadyExists, {
      email,
    });
  }
}

export class CannotAddUserError extends AppError {
  constructor(email: string) {
    super(ErrorCodes.CannotModifyUser, ErrorDescriptions.CannotModifyUser, {
      email,
    });
  }
}

export class CannotModifyUserError extends AppError {
  constructor(email: string) {
    super(ErrorCodes.CannotModifyUser, ErrorDescriptions.CannotModifyUser, {
      email,
    });
  }
}

export class CannotDeleteUserError extends AppError {
  constructor(email: string) {
    super(ErrorCodes.CannotDeleteUser, ErrorDescriptions.CannotDeleteUser, {
      email,
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super(ErrorCodes.Unauthorized, ErrorDescriptions.Unauthorized, {});
  }
}
