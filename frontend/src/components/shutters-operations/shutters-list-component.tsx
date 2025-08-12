import React, { useState, useEffect } from "react";
import type {
  IListShuttersResponse,
  IShutter,
} from "../../services/shutters-service.types";
import {
  callWithRemoteData,
  REMOTE_DATA_INIT,
  RemoteDataStatus,
  type RemoteData,
} from "../../services/remote-data";
import { listShutters } from "../../services/shutters-service";
import { Typography } from "@mui/material";
import { ShutterOperationComponent } from "./shutter-operation-component";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IShuttersListComponent {}

export const ShuttersListComponent: React.FC<IShuttersListComponent> = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props,
) => {
  const [shuttersList, setShuttersList] = useState<IShutter[]>([]);
  const [listShuttersRD, setListShuttersRD] =
    useState<RemoteData<IListShuttersResponse>>(REMOTE_DATA_INIT);

  useEffect(() => {
    if (listShuttersRD.status === RemoteDataStatus.Init) {
      callWithRemoteData<unknown, IListShuttersResponse>(
        listShutters,
        {},
        (newRd) => setListShuttersRD(newRd),
      );
    } else if (listShuttersRD.status === RemoteDataStatus.Loaded) {
      setShuttersList(listShuttersRD.payload);
    }
  }, [listShuttersRD]);

  return (
    <>
      <Typography variant="h5">List of shutters:</Typography>
      {shuttersList.map((shutter, index) => (
        <ShutterOperationComponent shutter={shutter} key={index} />
      ))}
    </>
  );
};
