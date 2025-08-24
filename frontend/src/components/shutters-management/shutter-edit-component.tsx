import React, { useState } from "react";
import type { IShutter } from "../../services/shutters-service.types";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useShuttersManagementApis } from "../../services/shutters-service";
import { useSnackbar } from "../snackbar-component";

import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

export interface IShutterEditComponent {
  shutter: IShutter;
  allShutters: IShutter[];
  shutterModified: (shutter: IShutter) => void;
}

export const ShutterEditComponent: React.FC<IShutterEditComponent> = (
  props,
) => {
  const { t } = useTranslation("shutter-edit-component", {
    nsMode: "default",
    useSuspense: false,
  });
  const shuttersManagementApi = useShuttersManagementApis();
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
      setErrorText(t("ErrorShutterNameEmpty"));
      return;
    }
    for (const shutter of props.allShutters) {
      if (
        shutter.shutterName === value &&
        shutter.shutterId !== currentShutter.shutterId
      ) {
        setErrorText(t("ErrorShutterAlreadyExists"));
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
      await shuttersManagementApi.modifyShutter(currentShutter);
      props.shutterModified(currentShutter);
      setSnackbarProps({
        message: t("MsgShutterRenamed"),
        severity: "success",
      });
      setEdit(false);
    } catch (error) {
      console.error("ShutterEditComponent: applyChanges: error occured : ", {
        currentShutter,
        error,
      });
      setSnackbarProps({
        message: t("MsgShutterErrorRenamed"),
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
                {t("NewName")}
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
        <CardActions>
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
                {t("Apply")}
              </Button>
              <Button
                startIcon={<CloseIcon />}
                onClick={() => setEdit(false)}
                color="info"
              >
                {t("Cancel")}
              </Button>
            </Grid>
          ) : (
            <Button startIcon={<EditIcon />} onClick={() => setEdit(true)}>
              {t("Modify")}
            </Button>
          )}
        </CardActions>
      </Card>
      <SnackbarComponent />
    </>
  );
};
