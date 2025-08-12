export enum RemoteDataStatus {
  Init = "init",
  Loading = "loading",
  Loaded = "loaded",
  Error = "error",
}

export interface IRemoteDataInit {
  status: RemoteDataStatus.Init;
}

export interface IRemoteDataLoading {
  status: RemoteDataStatus.Loading;
}

export interface IRemoteDataLoaded<T> {
  status: RemoteDataStatus.Loaded;
  payload: T;
}

export interface IRemoteDataError {
  status: RemoteDataStatus.Error;
  error: unknown;
}

export type RemoteData<T> =
  | IRemoteDataInit
  | IRemoteDataLoading
  | IRemoteDataLoaded<T>
  | IRemoteDataError;

export const REMOTE_DATA_INIT: IRemoteDataInit = {
  status: RemoteDataStatus.Init,
};
export const REMOTE_DATA_LOADING: IRemoteDataLoading = {
  status: RemoteDataStatus.Loading,
};

export async function callWithRemoteData<TRequest, TResponse>(
  f: (request: TRequest) => Promise<TResponse>,
  request: TRequest,
  notification: (newRd: RemoteData<TResponse>) => void,
) {
  notification(REMOTE_DATA_LOADING);
  try {
    const response = await f(request);
    notification({
      status: RemoteDataStatus.Loaded,
      payload: response,
    });
  } catch (error: unknown) {
    notification({
      status: RemoteDataStatus.Error,
      error,
    });
  }
}
