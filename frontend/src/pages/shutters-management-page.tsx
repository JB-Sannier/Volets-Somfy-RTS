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
import { listShutters } from "../services/shutters-service";
import { Fab } from "@mui/material";
import { ShutterEditComponent } from "../components/shutters-management/shutter-edit-component";
import { GeneralLayout } from "../layouts/general-layout";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { TitleComponent } from "../components/title-component";

export const ShuttersManagementPage: React.FC = () => {
  const navigate = useNavigate();
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
      <TitleComponent title="Shutters programmation" />

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
        aria-label="New shutter"
        sx={{ position: "absolute", bottom: 10, right: 5 }}
        onClick={() => navigate("/add-shutter")}
      >
        <AddIcon />
      </Fab>
    </GeneralLayout>
  );
};
