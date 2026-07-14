import React, { useState, useEffect } from "react";
import { useLightsManagementApis } from "../../services/lights-management-service";
import type { ILight } from "../../services/lights-management-service.types";
import {
  callWithRemoteData,
  RemoteDataStatus,
  type RemoteData,
} from "../../services/remote-data";
import { TitleComponent } from "../title-component";
import { useTranslation } from "react-i18next";
import { LightOperationComponent } from "./light-operation-component";

export const LightsListComponent: React.FC = () => {
  const { t } = useTranslation("lights-list-component");
  const listsManagementApis = useLightsManagementApis();

  const [lights, setLights] = useState<ILight[]>([]);

  function listLightsRD_change(newRD: RemoteData<ILight[]>) {
    if (newRD.status === RemoteDataStatus.Loaded) {
      setLights(newRD.payload);
    } else if (newRD.status === RemoteDataStatus.Error) {
      console.error("Error occurred while fetching lights");
      setLights([]);
    }
  }

  useEffect(() => {
    callWithRemoteData<void, ILight[]>(
      listsManagementApis.listLights,
      undefined,
      listLightsRD_change,
    );
  }, []);

  return (
    <>
      <TitleComponent title={t("LightsList")} />
      {lights.map((light, index) => (
        <LightOperationComponent light={light} key={index} />
      ))}
    </>
  );
};
