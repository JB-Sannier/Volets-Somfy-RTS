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
import { useShuttersManagementApis } from "../../services/shutters-service";
import { ShutterOperationComponent } from "./shutter-operation-component";
import { TitleComponent } from "../title-component";
import { useTranslation } from "react-i18next";

export const ShuttersListComponent: React.FC = () => {
  const { t } = useTranslation("shutters-list-component");
  const shuttersManagementApi = useShuttersManagementApis();

  const [shuttersList, setShuttersList] = useState<IShutter[]>([]);
  const [listShuttersRD, setListShuttersRD] =
    useState<RemoteData<IListShuttersResponse>>(REMOTE_DATA_INIT);

  useEffect(() => {
    if (listShuttersRD.status === RemoteDataStatus.Init) {
      callWithRemoteData<unknown, IListShuttersResponse>(
        shuttersManagementApi.listShutters,
        {},
        (newRd) => setListShuttersRD(newRd),
      );
    } else if (listShuttersRD.status === RemoteDataStatus.Loaded) {
      setShuttersList(listShuttersRD.payload);
    }
  }, [listShuttersRD, shuttersManagementApi.listShutters]);

  return (
    <>
      <TitleComponent title={t("ShuttersList")} />
      {shuttersList.map((shutter, index) => (
        <ShutterOperationComponent shutter={shutter} key={index} />
      ))}
    </>
  );
};
