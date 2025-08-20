import React, { useState } from "react";
import {
  UserRole,
  type IDeleteUserRequest,
  type IUserResponse,
} from "../../services/users-service.types";
import { useUserApis } from "../../services/users-service";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Grid,
  Typography,
} from "@mui/material";
import { useSnackbar } from "../snackbar-component";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

export interface IUserComponentProps {
  user: IUserResponse;
  onUserModified: (user: IUserResponse) => void;
  onUserDeleted: (user: IUserResponse) => void;
}

export const UserComponent: React.FC<IUserComponentProps> = (props) => {
  const { t } = useTranslation("user-component");
  const userApis = useUserApis();
  const { setSnackbarProps, SnackbarComponent } = useSnackbar();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const navigate = useNavigate();

  async function modifyUser() {
    navigate(`/users-management/modify-user/${props.user.email}`);
  }

  function toRoleStrings(): string[] {
    const result: string[] = [];
    props.user.roles.forEach((role) => {
      if (role === UserRole.ShuttersProgrammer) {
        result.push(t("RoleShutterManager"));
      } else if (role === UserRole.UserManager) {
        result.push(t("RoleUserManager"));
      }
    });
    if (result.length === 0) {
      result.push(t("RoleNone"));
    }
    return result;
  }

  async function confirmDeletion() {
    const request: IDeleteUserRequest = {
      email: props.user.email,
    };
    await userApis.deleteUser(request);
    setSnackbarProps({
      message: t("MessageUserDeleted", { email: props.user.email }),
      severity: "success",
    });
    props.onUserDeleted(props.user);
  }

  return (
    <>
      <Card sx={{ mb: 3 }} raised>
        <CardHeader
          title={
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid>
                <PersonIcon fontSize="large" sx={{ mt: 0 }} />
              </Grid>
              <Grid>{t("Email", { email: props.user.email })}</Grid>
            </Grid>
          }
        />
        <CardContent sx={{ pl: 5 }}>
          <Typography variant="body1">
            Roles : <b>{toRoleStrings().join(", ")}</b>
          </Typography>
          <Typography
            variant="body1"
            color={props.user.isActive ? "success" : "warning"}
          >
            {props.user.isActive ? (
              <>
                {t("UserIs")} <b>{t("Active")}</b>
              </>
            ) : (
              <>
                {t("UserIs")} <b>{t("Inactive")}</b>
              </>
            )}
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={modifyUser} startIcon={<EditIcon />}>
            {t("ModifyUser")}
          </Button>
          <Button
            onClick={() => setOpenModal(true)}
            color="warning"
            startIcon={<DeleteIcon />}
          >
            {t("DeleteUser")}
          </Button>
        </CardActions>
      </Card>
      <SnackbarComponent />
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{t("ConfirmUserDeletion")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("ConfirmUserDeletionContent", { email: props.user.email })}
          </DialogContentText>
          <DialogActions>
            <Button onClick={confirmDeletion} color="warning">
              {t("ConfirmDeleteUserAction")}
            </Button>
            <Button onClick={() => setOpenModal(false)}>
              {t("CancelAction")}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Fab
        color="primary"
        sx={{ position: "absolute", bottom: 10, right: 5 }}
        onClick={() => navigate("/users-management/add-user")}
        title={t("FabTitle")}
      >
        <AddIcon />
      </Fab>
    </>
  );
};
