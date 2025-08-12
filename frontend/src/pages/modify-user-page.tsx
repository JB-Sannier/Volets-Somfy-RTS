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
import { listUsers, modifyUser } from "../services/users-service";
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

export const ModifyUserPage: React.FC = () => {
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
        listUsers,
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
      console.log("Will update an user : ", modifyRequest);
      await modifyUser(modifyRequest);
      setSnackbarProps({
        message: "User successfully updated.",
        severity: "success",
      });
      setShowUpdateDoneDialog(true);
    } catch (error) {
      console.error(
        "While updating the user, got an error : ",
        { ...modifyRequest, password: undefined },
        error,
      );
    }
  }

  return (
    <GeneralLayout>
      <TitleComponent title="Modify a user" />
      <Typography variant="h6">
        Use email : <b>{userFound?.email}</b>
      </Typography>
      <Typography variant="body1">
        Password :
        <Button onClick={onChangePassword} variant="contained" sx={{ ml: 3 }}>
          Change password
        </Button>
      </Typography>
      <FormGroup sx={{ mt: 3 }}>
        <FormControlLabel
          control={<Switch />}
          checked={isActive}
          onChange={(_e, checked) => setIsActive(checked)}
          label="Active account"
        />
        <FormHelperText sx={{ ml: 3 }}>
          An inactive account cannot use the application.
        </FormHelperText>
        <FormControlLabel
          control={<Switch />}
          checked={roleShutterManager}
          onChange={(_e, checked) => setRoleShutterManager(checked)}
          label="Shutters manager"
        />
        <FormHelperText sx={{ ml: 3 }}>
          The shutters manager can rename, remove and add shutters into the
          application.
        </FormHelperText>
        <FormControlLabel
          control={<Switch />}
          checked={roleUserManager}
          onChange={(_e, checked) => setRoleUserManager(checked)}
          label="Users manager"
        />
        <FormHelperText sx={{ ml: 3 }}>
          The user manager can create, modify and delete users.
        </FormHelperText>
      </FormGroup>
      <Button onClick={updateUser} variant="contained" sx={{ mt: 3 }}>
        Update user
      </Button>
      <SnackbarComponent />
      <ChangePasswordDialog
        open={showPasswordDialog}
        passwordUpdateCancelled={passwordUpdateCancelled}
        passwordUpdated={passwordUpdated}
      />
      <Dialog open={showUpdateDoneDialog}>
        <DialogTitle>Used updated</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The user has been successfully updated.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate("/users-management")}>
            Return to Users Management
          </Button>
        </DialogActions>
      </Dialog>
    </GeneralLayout>
  );
};
