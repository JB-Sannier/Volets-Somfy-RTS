import React from "react";
import type { IShutter } from "../../services/shutters-service.types";
import { Grid, IconButton, Paper, Typography } from "@mui/material";

import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import {
  lowerShutter,
  raiseShutter,
  stopShutter,
} from "../../services/shutters-operations-service";
import { useSnackbar } from "../snackbar-component";

export interface IShutterOperationProps {
  shutter: IShutter;
}

export const ShutterOperationComponent: React.FC<IShutterOperationProps> = (
  props,
) => {
  const { SnackbarComponent, setSnackbarProps } = useSnackbar();

  function onRaiseShutter() {
    setSnackbarProps({
      message: `Raising shutter ${props.shutter.shutterName} ...`,
      severity: "info",
    });
    raiseShutter({ shutterId: props.shutter.shutterId });
  }

  function onStopShutter() {
    setSnackbarProps({
      message: `Stopping shutter ${props.shutter.shutterName} ...`,
      severity: "info",
    });
    stopShutter({ shutterId: props.shutter.shutterId });
  }

  function onLowerShutter() {
    setSnackbarProps({
      message: `Lowering shutter ${props.shutter.shutterName} ...`,
      severity: "info",
    });
    lowerShutter({ shutterId: props.shutter.shutterId });
  }

  return (
    <Paper>
      <Grid container direction="row" alignItems="center">
        <Grid flexGrow={1}>
          <Typography variant="body1">{props.shutter.shutterName}</Typography>
        </Grid>
        <Grid>
          <IconButton onClick={onRaiseShutter} title="Raise shutter">
            <KeyboardDoubleArrowUpIcon />
          </IconButton>
        </Grid>
        <Grid>
          <IconButton onClick={onStopShutter} title="Raise shutter">
            <StopCircleIcon />
          </IconButton>
        </Grid>
        <Grid>
          <IconButton onClick={onLowerShutter} title="Raise shutter">
            <KeyboardDoubleArrowDownIcon />
          </IconButton>
        </Grid>
      </Grid>
      <SnackbarComponent />
    </Paper>
  );
};
