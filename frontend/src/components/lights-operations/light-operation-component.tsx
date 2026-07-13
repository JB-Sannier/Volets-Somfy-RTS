import React from "react";
import { useTranslation } from "react-i18next";
import {
  LightTypes,
  type ILight,
} from "../../services/lights-management-service.types";
import { useLightsOperationApis } from "../../services/lights-operations-service";
import { Grid, Paper, Typography, IconButton } from "@mui/material";
import FlashOffIcon from '@mui/icons-material/FlashOff';
import FlashOnIcon from '@mui/icons-material/FlashOn';

export interface ILightOperationComponentProps {
  light: ILight;
}

export const LightOperationComponent: React.FC<
  ILightOperationComponentProps
> = (props: ILightOperationComponentProps) => {
  const { t } = useTranslation("light-operation-component");
  const lightsOperationApis = useLightsOperationApis();

  async function switchLightOn() {
    await lightsOperationApis.switchOnLight({ lightId: props.light.lightId });
  }

  async function switchLightOff() {
    await lightsOperationApis.switchOffLight({ lightId: props.light.lightId });
  }

  async function switchLight() {
    await lightsOperationApis.switchLight({ lightId: props.light.lightId });
  }

  return (
    <Paper sx={{ mb: 3, p: 2 }} elevation={6}>
      <Typography variant="body1">{props.light.lightName}</Typography>
      {props.light.description && (
        <Typography variant="body2">{props.light.description}</Typography>
      )}
      <Grid
        container
        spacing={2}
        direction="row"
        size="grow"
        sx={{
          justifyContent: "center",
          alignSelf: "flex-end",
          flex: 1,
        }}
      >
        {props.light.type === LightTypes.TYPE_TWO_BUTTONS && (
          <>
            <IconButton
              onClick={()=>switchLightOn()}
              title={t("Switch_On")}
              size="large"
              color="primary"
            >
              <FlashOnIcon fontSize="large"/>
            </IconButton>
            <IconButton
              onClick={()=>switchLightOff()}
              title={t("Switch_Off")}
              size="large"
              color="primary"
            >
              <FlashOffIcon fontSize="large"/>
            </IconButton>
          </>
        )}
        {props.light.type === LightTypes.TYPE_SWITCH && (
          <IconButton
            onClick={() => switchLight()}
            title={t("Switch")}
            size="large"
            color="primary"
          >
            <FlashOnIcon fontSize="large"/>
          </IconButton>
        )}
      </Grid>
    </Paper>
  );
};
