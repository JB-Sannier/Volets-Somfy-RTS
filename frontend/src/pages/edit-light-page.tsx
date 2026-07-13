import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  callWithRemoteData,
  REMOTE_DATA_INIT,
  type RemoteData,
  RemoteDataStatus,
} from "../services/remote-data";
import { Typography, Button, Stack } from "@mui/material";
import { useSnackbar } from "../components/snackbar-component";
import { useTranslation } from "react-i18next";
import { useLightsManagementApis } from "../services/lights-management-service";
import type {
  IGetLightRequest,
  ILight,
} from "../services/lights-management-service.types";
import { LightEditComponent } from "../components/lights-management/light-edit-component";
import { GeneralLayout } from "../layouts/general-layout";
import { useAuthContext } from "../contexts/auth-context.types";
import { UserRole } from "../services/users-service.types";

export const EditLightPage: React.FC = () => {
  const { t } = useTranslation("edit-light-page");
  const lightsManagementApis = useLightsManagementApis();
  const searchParams = useParams();
  const authContext = useAuthContext();

  const navigate = useNavigate();
  const { setSnackbarProps, SnackbarComponent } = useSnackbar();

  const lightId = searchParams.lightId || "";

  const [lightFound, setLightFound] = useState<ILight | undefined>(undefined);
  const [fetchLightRD, setFetchLightRD] =
    useState<RemoteData<ILight>>(REMOTE_DATA_INIT);
  const [lightUpdated, setLightUpdated] = useState<boolean>(false);

  useEffect( ()=> {
    if (!authContext.hasRole(UserRole.LightsProgrammer)) {
      navigate("/");
    }
  }, []);


  function updateFetchLightRD(newRD: RemoteData<ILight>) {
    setFetchLightRD(newRD);
    if (newRD.status === RemoteDataStatus.Loaded) {
      setLightFound(newRD.payload);
    }
  }

  if (fetchLightRD.status === RemoteDataStatus.Init) {
    callWithRemoteData<IGetLightRequest, ILight>(
      lightsManagementApis.getLight,
      { lightId },
      updateFetchLightRD,
    );
  }

  const [lightsList, setLightsList] = React.useState<ILight[]>([]);
  const [listLightsRD, setListLightsRD] =
    React.useState<RemoteData<ILight[]>>(REMOTE_DATA_INIT);

  function updateListLightsRD(newRD: RemoteData<ILight[]>) {
    setListLightsRD(newRD);
    if (newRD.status === RemoteDataStatus.Loaded) {
      setLightsList(newRD.payload);
    }
  }

  if (listLightsRD.status === RemoteDataStatus.Init) {
    callWithRemoteData<void, ILight[]>(
      lightsManagementApis.listLights,
      undefined,
      updateListLightsRD,
    );
  }

  function lightModified(updatedLight: ILight) {
    setLightFound(updatedLight);
  }

  async function light_save(updatedLight: ILight) {
    if (lightFound?.lightId === "") {
      const newLight = await lightsManagementApis.addLight(updatedLight);
      setLightFound(newLight);
      setSnackbarProps({
        message: t("LightAddedSuccessfully"),
        severity: "success",
      });
      setLightUpdated(true);
    } else {
      const light = await lightsManagementApis.updateLight(updatedLight);
      setLightFound(light);
      setSnackbarProps({
        message: t("LightUpdatedSuccessfully"),
        severity: "success",
      });
      setLightUpdated(true);
    }
  }

  return (
    <GeneralLayout>
      {fetchLightRD.status === RemoteDataStatus.Loaded && lightFound ? (
        <LightEditComponent
          allLights={lightsList}
          light={lightFound}
          lightModified={lightModified}
          saveLight={light_save}
          disabled={lightUpdated}
        />
      ) : (
        <Typography variant="body1">{t("Loading")}</Typography>
      )}
      {lightUpdated && (
        <Stack
          sx={{
            alignItems: "center",
          }}
        >
          <Typography variant="body1" sx={{ mt: 3 }}>
            {t("LightUpdatedSuccessfully")}
          </Typography>
          <Button
            onClick={() => navigate("/lights-management")}
            title={t("Return")}
            variant="contained"
          >
            {t("Return")}
          </Button>
        </Stack>
      )}
      <SnackbarComponent />
    </GeneralLayout>
  );
};
