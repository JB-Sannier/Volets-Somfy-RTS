import React from "react";
import { useNavigate } from "react-router-dom";
import { useLightsManagementApis } from "../../services/lights-management-service";
import { useTranslation } from "react-i18next";
import type { ILight } from "../../services/lights-management-service.types";
import {
  callWithRemoteData,
  RemoteDataStatus,
  REMOTE_DATA_INIT,
  type RemoteData,
} from "../../services/remote-data";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Paper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "../snackbar-component";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const LightsManagementListComponent: React.FC = () => {
  const navigate = useNavigate();
  const lightsManagementApis = useLightsManagementApis();
  const { t } = useTranslation("lights-management-list-component");
  const { SnackbarComponent, setSnackbarProps } = useSnackbar();

  const [lightsList, setLightsList] = React.useState<ILight[]>([]);
  const [listLightsRD, setListLightsRD] =
    React.useState<RemoteData<ILight[]>>(REMOTE_DATA_INIT);

  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const [lightToDelete, setLightToDelete] = React.useState<
    ILight | undefined
  >();

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

  function deleteLight(light: ILight) {
    setLightToDelete(light);
    setIsDialogOpen(true);
  }

  async function onDeleteLight() {
    if (lightToDelete) {
      try {
        await lightsManagementApis.deleteLight({
          lightId: lightToDelete.lightId,
        });
        setIsDialogOpen(false);
        setSnackbarProps({
          message: t("LightDeleted"),
          severity: "success",
        });
        setLightsList(
          lightsList.filter(
            (element) => element.lightId !== lightToDelete.lightId,
          ),
        );
      } catch (error) {
        console.log(
          "LightManagementListComponent: onDeleteLight: got error : ",
          error,
        );
        setSnackbarProps({
          message: t("ErrorDeletingLight"),
          severity: "error",
        });
      }
    }
  }

  return (
    <>
      {lightsList.map((light, index) => (
        <Paper key={index} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6">{light.lightName}</Typography>
          <Typography variant="body2">{light.description}</Typography>
          <Button
            startIcon={<EditIcon />}
            onClick={() =>
              navigate(`/lights-management/edit-light/${light.lightId}`)
            }
          >
            {t("Edit")}
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            onClick={() => deleteLight(light)}
            color="warning"
            sx={{ marginLeft: 1 }}
          >
            {t("Delete")}
          </Button>
        </Paper>
      ))}
      <Fab
        color="primary"
        aria-label={t("NewLight")}
        title={t("NewLight")}
        sx={{ position: "absolute", bottom: 10, right: 5 }}
        onClick={() => navigate("/lights-management/add-light")}
      >
        <AddIcon />
      </Fab>
      <Dialog open={isDialogOpen}>
        <DialogTitle>{t("DeleteLightTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("AskLightDeletionConfirmation")}
          </DialogContentText>
          <DialogContentText>
            {t("LightToDeleteName", {
              lightName: lightToDelete?.lightName || "",
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteLight} variant="contained" color="warning">
            {t("ConfirmDeleteLight")}
          </Button>
          <Button onClick={() => setIsDialogOpen(false)} variant="contained">
            {t("Cancel")}
          </Button>
        </DialogActions>
      </Dialog>
      <SnackbarComponent />
    </>
  );
};
