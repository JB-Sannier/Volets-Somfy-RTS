export enum ErrorCodes {
  ValidationError = "INVALID_REQUEST",
  Unauthorized = "UNAUTHORIZED",
  LightNotFound = "LIGHT_NOT_FOUND",
  LightAlreadyExists = "LIGHT_ALREADY_EXISTS",
  CannotUpdateLight = "CANNOT_UPDATE_LIGHT",
  CannotDeleteLight = "CANNOT_DELETE_LIGHT",
  LightProxyServiceError = "LIGHT_PROXY_SERVICE_ERROR",
}

export enum ErrorDescriptions {
  Unauthorized = "You are not authorized to access this resource",
  LightNotFound = "Light not found",
  LightAlreadyExists = "Light already exists",
  CannotUpdateLight = "Cannot update light",
  CannotDeleteLight = "Cannot delete light",
  LightProxyServiceError = "An error occured when contacting proxy.",
}

export abstract class AppError extends Error {
  public errorCode: ErrorCodes;
  public description: ErrorDescriptions;
  public payload?: object;

  public abstract getHttpResponseCode(): number;

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

export class UnauthorizedError extends AppError {
  constructor() {
    super(ErrorCodes.Unauthorized, ErrorDescriptions.Unauthorized, {});
  }
  public getHttpResponseCode(): number {
    return 403;
  }
}

export class LightNotFoundError extends AppError {
  constructor(lightId: string) {
    super(ErrorCodes.LightNotFound, ErrorDescriptions.LightNotFound, {
      lightId,
    });
  }
  public getHttpResponseCode(): number {
    return 404;
  }
}

export class LightAlreadyExistsError extends AppError {
  constructor(lightId: string) {
    super(ErrorCodes.LightAlreadyExists, ErrorDescriptions.LightAlreadyExists, {
      lightId,
    });
  }
  public getHttpResponseCode(): number {
    return 400;
  }
}

export class CannotUpdateLightError extends AppError {
  constructor(lightId: string) {
    super(ErrorCodes.CannotUpdateLight, ErrorDescriptions.CannotUpdateLight, {
      lightId,
    });
  }
  public getHttpResponseCode(): number {
    return 400;
  }
}

export class CannotDeleteLightError extends AppError {
  constructor(lightId: string) {
    super(ErrorCodes.CannotDeleteLight, ErrorDescriptions.CannotDeleteLight, {
      lightId,
    });
  }
  public getHttpResponseCode(): number {
    return 400;
  }
}

export class LightProxyServiceError extends AppError {
  constructor(payload: object) {
    super(
      ErrorCodes.LightProxyServiceError,
      ErrorDescriptions.LightProxyServiceError,
      { payload },
    );
  }
  public getHttpResponseCode(): number {
    return 500;
  }
}
