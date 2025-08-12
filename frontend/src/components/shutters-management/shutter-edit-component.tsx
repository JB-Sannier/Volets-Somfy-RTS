import React, { useState } from "react";
import type { IShutter } from "../../services/shutters-service.types";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { modifyShutter } from "../../services/shutters-service";
import { useSnackbar } from "../snackbar-component";

import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

export interface IShutterEditComponent {
  shutter: IShutter;
  allShutters: IShutter[];
  shutterModified: (shutter: IShutter) => void;
}

export const ShutterEditComponent: React.FC<IShutterEditComponent> = (
  props,
) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [currentShutter, setCurrentShutter] = useState<IShutter>(props.shutter);
  const [errorText, setErrorText] = useState<string | undefined>(undefined);
  const { SnackbarComponent, setSnackbarProps } = useSnackbar();

  function onChangeShutterName(value: string) {
    setCurrentShutter({
      shutterId: currentShutter.shutterId,
      shutterName: value,
    });
    if (value === "") {
      setErrorText("Please provide a name for the shutter.");
      return;
    }
    for (const shutter of props.allShutters) {
      if (
        shutter.shutterName === value &&
        shutter.shutterId !== currentShutter.shutterId
      ) {
        setErrorText("A shutter has already this name.");
        return;
      }
    }
    setErrorText(undefined);
  }

  async function applyChanges() {
    if (errorText !== undefined) {
      return;
    }
    try {
      await modifyShutter(currentShutter);
      props.shutterModified(currentShutter);
      setSnackbarProps({
        message: "Shutter renamed.",
        severity: "success",
      });
      setEdit(false);
    } catch (error) {
      console.error("ShutterEditComponent: applyChanges: error occured : ", {
        currentShutter,
        error,
      });
      setSnackbarProps({
        message: "Error renaming shutter",
        severity: "error",
      });
    }
  }

  return (
    <>
      <Card sx={{ mb: 3 }} raised>
        <CardContent>
          <Typography variant="body1">{currentShutter.shutterName}</Typography>

          {edit && (
            <>
              <Typography variant="body2" sx={{ mt: 3 }}>
                New name:
              </Typography>
              <TextField
                value={currentShutter.shutterName}
                onChange={(e) => onChangeShutterName(e.target.value)}
                error={errorText !== undefined}
                helperText={errorText || ""}
                fullWidth
              />
            </>
          )}
        </CardContent>
        <CardActionArea>
          {edit ? (
            <Grid>
              <Button
                startIcon={<DoneIcon />}
                onClick={applyChanges}
                disabled={
                  errorText !== undefined ||
                  currentShutter.shutterName === props.shutter.shutterName
                }
                color={errorText === undefined ? "success" : "error"}
              >
                Apply
              </Button>
              <Button
                startIcon={<CloseIcon />}
                onClick={() => setEdit(false)}
                color="info"
              >
                Cancel
              </Button>
            </Grid>
          ) : (
            <Button startIcon={<EditIcon />} onClick={() => setEdit(true)}>
              Modify
            </Button>
          )}
        </CardActionArea>
      </Card>
      <SnackbarComponent />
    </>
  );
};
