export enum ErrorCodes {
  Unauthorized = "UNAUTHORIZED",
  ShutterNotFound = "SHUTTER_NOT_FOUND",
  ShutterAlreadyExists = "SHUTTER_ALREADY_EXISTS",
  SomfyProxyServiceError = "SOMFY_PROXY_SERVICE_ERROR",
}

export enum ErrorDescriptions {
  Unauthorized = "You are not authorized to access this resource",
  ShutterNotFound = "Shutter not found",
  ShutterAlreadyExists = "Shutter already exists",
  SomfyProxyServiceError = "An error occured when contacting proxy.",
}

export class AppError {
  public errorCode: ErrorCodes;
  public description: ErrorDescriptions;
  public payload?: object;

  constructor(
    errorCode: ErrorCodes,
    description: ErrorDescriptions,
    payload?: object,
  ) {
    this.errorCode = errorCode;
    this.description = description;
    this.payload = payload;
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super(ErrorCodes.Unauthorized, ErrorDescriptions.Unauthorized, {});
  }
}

export class ShutterNotFoundError extends AppError {
  constructor(shutterId: string) {
    super(ErrorCodes.ShutterNotFound, ErrorDescriptions.ShutterNotFound, {
      shutterId,
    });
  }
}

export class ShutterAlreadyExistsError extends AppError {
  constructor(shutterId: string) {
    super(
      ErrorCodes.ShutterAlreadyExists,
      ErrorDescriptions.ShutterAlreadyExists,
      { shutterId },
    );
  }
}

export class SomfyProxyServiceError extends AppError {
  constructor(payload: object) {
    super(
      ErrorCodes.SomfyProxyServiceError,
      ErrorDescriptions.SomfyProxyServiceError,
      { payload },
    );
  }
}
