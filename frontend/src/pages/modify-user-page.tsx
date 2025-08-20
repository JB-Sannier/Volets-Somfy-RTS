import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  UserRole,
  type IListUsersResponse,
  type IModifyUserRequest,
  type IUserResponse,
} from "../services/users-service.types";
import {
  callWithRemoteData,
  REMOTE_DATA_INIT,
  type RemoteData,
  RemoteDataStatus,
} from "../services/remote-data";
import { useUserApis } from "../services/users-service";
import { GeneralLayout } from "../layouts/general-layout";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Switch,
  Typography,
} from "@mui/material";
import { useSnackbar } from "../components/snackbar-component";
import { ChangePasswordDialog } from "../components/users-management/change-password-dialog";
import { TitleComponent } from "../components/title-component";
import { useTranslation } from "react-i18next";

export const ModifyUserPage: React.FC = () => {
  const { t } = useTranslation("modify-user-page");
  const userApis = useUserApis();
  const searchParams = useParams();
  const navigate = useNavigate();
  const { setSnackbarProps, SnackbarComponent } = useSnackbar();
  const email = searchParams.email;

  const [userFound, setUserFound] = useState<IUserResponse | undefined>(
    undefined,
  );
  const [listUsersRD, setListUsersRD] =
    useState<RemoteData<IListUsersResponse>>(REMOTE_DATA_INIT);

  const [isActive, setIsActive] = useState<boolean>(false);
  const [roleShutterManager, setRoleShutterManager] = useState<boolean>(false);
  const [roleUserManager, setRoleUserManager] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string | undefined>(undefined);

  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);
  const [showUpdateDoneDialog, setShowUpdateDoneDialog] =
    useState<boolean>(false);

  function passwordUpdated(pass: string) {
    setShowPasswordDialog(false);
    setNewPassword(pass);
  }

  function passwordUpdateCancelled() {
    setShowPasswordDialog(false);
  }

  if (!email) {
    navigate("/users-management");
  } else {
    if (listUsersRD.status === RemoteDataStatus.Init) {
      callWithRemoteData<undefined, IListUsersResponse>(
        userApis.listUsers,
        undefined,
        (newRd) => setListUsersRD(newRd),
      );
    }
  }

  useEffect(() => {
    if (listUsersRD.status === RemoteDataStatus.Loaded) {
      const user = listUsersRD.payload.find((u) => u.email == email);
      if (user) {
        setUserFound(user);
        setIsActive(user.isActive);
        setRoleShutterManager(
          user.roles.find((r) => r === UserRole.ShuttersProgrammer) !==
            undefined,
        );
        setRoleUserManager(
          user.roles.find((r) => r === UserRole.UserManager) !== undefined,
        );
      }
    }
  }, [listUsersRD, email]);

  function onChangePassword() {
    setShowPasswordDialog(true);
  }

  async function updateUser() {
    if (!email) {
      return;
    }
    const allRoles: UserRole[] = [];
    if (roleShutterManager) {
      allRoles.push(UserRole.ShuttersProgrammer);
    }
    if (roleUserManager) {
      allRoles.push(UserRole.UserManager);
    }

    const modifyRequest: IModifyUserRequest = {
      email,
      isActive,
      password: newPassword,
      roles: allRoles,
    };
    try {
      await userApis.modifyUser(modifyRequest);
      setSnackbarProps({
        message: t("UserSuccessfullyUpdated"),
        severity: "success",
      });
      setShowUpdateDoneDialog(true);
    } catch (error) {
      console.error(
        t("ErrorUpdatingUser"),
        { ...modifyRequest, password: undefined },
        error,
      );
    }
  }

  return (
    <GeneralLayout>
      <TitleComponent title={t("ModifyAUser")} />
      <Typography variant="h6">
        {t("UseEmail")} <b>{userFound?.email}</b>
      </Typography>
      <Typography variant="body1">
        {t("Password")}
        <Button onClick={onChangePassword} variant="contained" sx={{ ml: 3 }}>
          {t("ChangePassword")}
        </Button>
      </Typography>
      <FormGroup sx={{ mt: 3 }}>
        <FormControlLabel
          control={<Switch />}
          checked={isActive}
          onChange={(_e, checked) => setIsActive(checked)}
          label={t("ActiveAccount")}
        />
        <FormHelperText sx={{ ml: 3 }}>
          {t("ActiveAccountDescription")}
        </FormHelperText>
        <FormControlLabel
          control={<Switch />}
          checked={roleShutterManager}
          onChange={(_e, checked) => setRoleShutterManager(checked)}
          label={t("ShuttersManager")}
        />
        <FormHelperText sx={{ ml: 3 }}>
          {t("ShuttersManagerDescription")}
        </FormHelperText>
        <FormControlLabel
          control={<Switch />}
          checked={roleUserManager}
          onChange={(_e, checked) => setRoleUserManager(checked)}
          label={t("UsersManager")}
        />
        <FormHelperText sx={{ ml: 3 }}>
          {t("UsersManagerDescription")}
        </FormHelperText>
      </FormGroup>
      <Button onClick={updateUser} variant="contained" sx={{ mt: 3 }}>
        {t("UpdateUser")}
      </Button>
      <SnackbarComponent />
      <ChangePasswordDialog
        open={showPasswordDialog}
        passwordUpdateCancelled={passwordUpdateCancelled}
        passwordUpdated={passwordUpdated}
      />
      <Dialog open={showUpdateDoneDialog}>
        <DialogTitle>{t("UserUpdated")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("UserUpdatedDescription")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate("/users-management")}>
            {t("ReturnToUsersManagement")}
          </Button>
        </DialogActions>
      </Dialog>
    </GeneralLayout>
  );
};
