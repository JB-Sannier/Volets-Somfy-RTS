import React, { useState, useEffect } from "react";
import type {
  IListShuttersResponse,
  IShutter,
} from "../services/shutters-service.types";
import {
  callWithRemoteData,
  REMOTE_DATA_INIT,
  RemoteDataStatus,
  type RemoteData,
} from "../services/remote-data";
import { useShuttersManagementApis } from "../services/shutters-service";
import { Fab } from "@mui/material";
import { ShutterEditComponent } from "../components/shutters-management/shutter-edit-component";
import { GeneralLayout } from "../layouts/general-layout";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { TitleComponent } from "../components/title-component";
import { useTranslation } from "react-i18next";

export const ShuttersManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const shuttersManagementApis = useShuttersManagementApis();
  const { t } = useTranslation("shutters-management-page");

  const [shuttersList, setShuttersList] = useState<IShutter[]>([]);
  const [listShuttersRD, setListShuttersRD] =
    useState<RemoteData<IListShuttersResponse>>(REMOTE_DATA_INIT);

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

  function onShutterModified(newShutter: IShutter) {
    const newShuttersList: IShutter[] = [...shuttersList];
    const index = newShuttersList.findIndex(
      (s) => s.shutterId === newShutter.shutterId,
    );
    if (index !== -1) {
      newShuttersList[index] = newShutter;
    }
    setShuttersList(newShuttersList);
  }

  return (
    <GeneralLayout>
      <TitleComponent title={t("Title")} />

      {shuttersList.map((shutter, index) => (
        <ShutterEditComponent
          shutter={shutter}
          allShutters={shuttersList}
          key={index}
          shutterModified={onShutterModified}
        />
      ))}
      <Fab
        color="primary"
        aria-label={t("NewShutter")}
        title={t("NewShutter")}
        sx={{ position: "absolute", bottom: 10, right: 5 }}
        onClick={() => navigate("/add-shutter")}
      >
        <AddIcon />
      </Fab>
    </GeneralLayout>
  );
};
