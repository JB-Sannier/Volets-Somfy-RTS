import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GeneralLayout } from "../layouts/general-layout";
import { TitleComponent } from "../components/title-component";
import {
  type ILight,
  LightTypes,
  LightFrequencies,
  type IAddLightRequest,
} from "../services/lights-management-service.types";
import {
  type RemoteData,
  RemoteDataStatus,
  callWithRemoteData,
  REMOTE_DATA_INIT,
} from "../services/remote-data";
import { useLightsManagementApis } from "../services/lights-management-service";
import { LightEditComponent } from "../components/lights-management/light-edit-component";
import { useSnackbar } from "../components/snackbar-component";
import { Button, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/auth-context.types";
import { UserRole } from "../services/users-service.types";

const EMPTY_LIGHT: ILight = {
  lightId: "",
  lightName: "",
  description: "",
  type: LightTypes.TYPE_SWITCH,
  switchOnCode: 0,
  switchOffCode: 0,
  pulseLength: 0,
  protocol: 0,
  frequency: LightFrequencies.FREQ_433,
};

export const AddLightPage: React.FC = () => {
  const { t } = useTranslation("add-light-page");
  const navigate = useNavigate();
  const authContext = useAuthContext();
  useEffect(() => {
    if (!authContext.hasRole(UserRole.LightsProgrammer)) {
      console.log("User without LightsProgrammer role => out");
      navigate("/");
    }
  }, []);

  const lightsManagementApis = useLightsManagementApis();
  const { setSnackbarProps, SnackbarComponent } = useSnackbar();

  const [allLights, setAllLights] = useState<ILight[]>([]);
  const [getAllLightsRD, setAllLightsRD] =
    useState<RemoteData<ILight[]>>(REMOTE_DATA_INIT);

  const [currentLight, setCurrentLight] = useState<ILight>(EMPTY_LIGHT);

  const [lightAdded, setLightAdded] = useState<boolean>(false);

  function updateAllLightsRD(newRd: RemoteData<ILight[]>) {
    setAllLightsRD(newRd);
    if (newRd.status === RemoteDataStatus.Loaded) {
      setAllLights(newRd.payload);
    }
  }

  async function saveLight(light: ILight) {
    if (currentLight.lightId === "") {
      try {
        const addLightRequest: IAddLightRequest = {
          description: light.description,
          frequency: light.frequency,
          lightName: light.lightName,
          protocol: light.protocol,
          pulseLength: light.pulseLength,
          switchOffCode: light.switchOffCode,
          switchOnCode: light.switchOnCode,
          type: light.type,
        };
        const result = await lightsManagementApis.addLight(addLightRequest);
        setCurrentLight(result);
        setSnackbarProps({
          message: t("LightAddedSuccessfully"),
          severity: "success",
        });
        setLightAdded(true);
      } catch (error) {
        console.log("AddLightPage: saveLight: error adding light : ", error);
        setSnackbarProps({
          message: t("ErrorAddingLight"),
          severity: "error",
        });
      }
    } else {
      try {
        const result = await lightsManagementApis.updateLight(light);
        setCurrentLight(result);
        setSnackbarProps({
          message: t("LightUpdatedSuccessfully"),
          severity: "success",
        });
      } catch (error) {
        console.log("AddLightPage: saveLight: error updating light : ", error);
        setSnackbarProps({
          message: t("ErrorUpdatingLight"),
          severity: "error",
        });
      }
    }
  }

  if (getAllLightsRD.status === RemoteDataStatus.Init) {
    callWithRemoteData<void, ILight[]>(
      lightsManagementApis.listLights,
      undefined,
      updateAllLightsRD,
    );
  }

  return (
    <GeneralLayout>
      {authContext.hasRole(UserRole.LightsProgrammer) && (
        <>
          <TitleComponent title={t("AddLight")} />
          <LightEditComponent
            allLights={allLights}
            light={currentLight}
            lightModified={(light: ILight) => setCurrentLight(light)}
            saveLight={saveLight}
            disabled={lightAdded}
          />
          {lightAdded && (
            <Stack
              sx={{
                alignItems: "center",
              }}
            >
              <Typography variant="body1" sx={{ mt: 3 }}>
                {t("LightAddedSuccessfully")}
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
        </>
      )}
      <SnackbarComponent />
    </GeneralLayout>
  );
};
