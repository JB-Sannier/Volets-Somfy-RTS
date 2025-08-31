import React from "react";
import type { IShutter } from "../../services/shutters-service.types";
import { Grid, IconButton, Paper, Typography } from "@mui/material";

import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { useShuttersOperationApis } from "../../services/shutters-operations-service";
import { useSnackbar } from "../snackbar-component";
import { useTranslation } from "react-i18next";

export interface IShutterOperationProps {
  shutter: IShutter;
}

export const ShutterOperationComponent: React.FC<IShutterOperationProps> = (
  props,
) => {
  const shuttersOperationApis = useShuttersOperationApis();
  const { t } = useTranslation("shutter-operation-component");
  const { SnackbarComponent, setSnackbarProps } = useSnackbar();

  function onRaiseShutter() {
    setSnackbarProps({
      message: t("RaisingShutter", {
        shutterName: props.shutter.shutterName,
      }),
      severity: "info",
    });
    shuttersOperationApis.raiseShutter({ shutterId: props.shutter.shutterId });
  }

  function onStopShutter() {
    setSnackbarProps({
      message: t("StoppingShutter", { shutterName: props.shutter.shutterName }),
      severity: "info",
    });
    shuttersOperationApis.stopShutter({ shutterId: props.shutter.shutterId });
  }

  function onLowerShutter() {
    setSnackbarProps({
      message: t("LoweringShutter", { shutterName: props.shutter.shutterName }),
      severity: "info",
    });
    shuttersOperationApis.lowerShutter({ shutterId: props.shutter.shutterId });
  }

  return (
    <Paper sx={{ mb: 3, pl: 2 }} elevation={6}>
      <Typography variant="body1">{props.shutter.shutterName}</Typography>
      <Grid
        container
        direction="row"
        justifyContent="center"
        size="grow"
        alignSelf="flex-end"
        flex={1}
      >
        <Grid>
          <IconButton
            onClick={onRaiseShutter}
            title={t("RaiseShutter")}
            size="large"
            color="primary"
          >
            <KeyboardDoubleArrowUpIcon fontSize="large" />
          </IconButton>
        </Grid>
        <Grid>
          <IconButton
            onClick={onStopShutter}
            title={t("StopShutter")}
            size="large"
            color="primary"
          >
            <StopCircleIcon fontSize="large" />
          </IconButton>
        </Grid>
        <Grid>
          <IconButton
            onClick={onLowerShutter}
            title={t("LowerShutter")}
            size="large"
            color="primary"
          >
            <KeyboardDoubleArrowDownIcon fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
      <SnackbarComponent />
    </Paper>
  );
};
