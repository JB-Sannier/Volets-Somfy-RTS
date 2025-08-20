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
import { useAuthContext } from "../../contexts/auth-context.types";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../services/users-service.types";
import { TitleComponent } from "../title-component";
import { useTranslation } from "react-i18next";

export const ShuttersManagementListComponent: React.FC = () => {
  const authContext = useAuthContext();
  const navigate = useNavigate();
  const shuttersManagementApis = useShuttersManagementApis();
  const { t } = useTranslation("shutters-mgmt-list-component");
  const [shuttersList, setShuttersList] = useState<IShutter[]>([]);
  const [listShuttersRD, setListShuttersRD] =
    useState<RemoteData<IListShuttersResponse>>(REMOTE_DATA_INIT);

  useEffect(() => {
    if (!authContext.hasRole(UserRole.ShuttersProgrammer)) {
      navigate("/");
    } else if (listShuttersRD.status === RemoteDataStatus.Init) {
      callWithRemoteData<unknown, IListShuttersResponse>(
        shuttersManagementApis.listShutters,
        {},
        (newRd) => setListShuttersRD(newRd),
      );
    }
  }, [
    authContext,
    listShuttersRD.status,
    navigate,
    shuttersManagementApis.listShutters,
  ]);

  useEffect(() => {
    if (listShuttersRD.status === RemoteDataStatus.Init) {
      callWithRemoteData<unknown, IListShuttersResponse>(
        shuttersManagementApis.listShutters,
        {},
        (newRd) => setListShuttersRD(newRd),
      );
    } else if (listShuttersRD.status === RemoteDataStatus.Loaded) {
      setShuttersList(listShuttersRD.payload);
    }
  }, [listShuttersRD, shuttersManagementApis.listShutters]);

  return (
    <>
      <TitleComponent title={t("ShuttersProgrammation")} />
      {shuttersList.map((shutter, index) => (
        <p key={index}>
          {shutter.shutterId} - {shutter.shutterName}
        </p>
      ))}
    </>
  );
};
