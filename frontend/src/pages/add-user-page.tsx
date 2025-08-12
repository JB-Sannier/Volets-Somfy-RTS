import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  UserRole,
  type IAddUserRequest,
} from "../services/users-service.types";
import { addUser } from "../services/users-service";
import { useSnackbar } from "../components/snackbar-component";
import { TitleComponent } from "../components/title-component";

const ERR_EMAIL_ADDRESS_REQUIRED = "Email address is required.";
const ERR_EMAIL_INVALID_FORMAT = "Invalid email format.";
const ERR_PASSWORD_EMPTY = "Password is required.";
const ERR_PASSWORD_MISMATCH = "Passwords don't match.";

export const AddUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSnackbarProps, SnackbarComponent } = useSnackbar();

  const [email, setEmail] = useState<string>("");
  const [roleShutterManager, setRoleShutterManager] = useState<boolean>(false);
  const [roleUserManager, setRoleUserManager] = useState<boolean>(false);
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");

  const [emailErrorText, setEmailErrorText] = useState<string | undefined>(
    ERR_EMAIL_ADDRESS_REQUIRED,
  );
  const [password1ErrorText, setPassword1ErrorText] = useState<
    string | undefined
  >(ERR_PASSWORD_EMPTY);
  const [password2ErrorText, setPassword2ErrorText] = useState<
    string | undefined
  >(ERR_PASSWORD_EMPTY);

  const [isUserAdded, setIsUserAdded] = useState<boolean>(false);

  function updateEmail(value: string) {
    setEmail(value);
    if (value === "") {
      setEmailErrorText(ERR_EMAIL_ADDRESS_REQUIRED);
      return;
    }
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!pattern.test(value) && !value.endsWith("@localhost")) {
      setEmailErrorText(ERR_EMAIL_INVALID_FORMAT);
      return;
    }
    setEmailErrorText(undefined);
  }

  function updatePassword1(value: string) {
    setPassword1(value);
    if (value === "") {
      setPassword1ErrorText(ERR_PASSWORD_EMPTY);
      return;
    } else if (value !== password2 && password2 !== "") {
      setPassword1ErrorText(ERR_PASSWORD_MISMATCH);
      setPassword2ErrorText(ERR_PASSWORD_MISMATCH);
      return;
    }
    if (value !== "" && password2 !== "" && value === password2) {
      setPassword2ErrorText(undefined);
    }
    setPassword1ErrorText(undefined);
  }

  function updatePassword2(value: string) {
    setPassword2(value);

    if (value === "") {
      setPassword2ErrorText(ERR_PASSWORD_EMPTY);
      return;
    } else if (value !== password1 && password1 !== "") {
      setPassword1ErrorText(ERR_PASSWORD_MISMATCH);
      setPassword2ErrorText(ERR_PASSWORD_MISMATCH);
      return;
    }
    if (value !== "" && password1 !== "" && value === password1) {
      setPassword1ErrorText(undefined);
    }
    setPassword2ErrorText(undefined);
  }

  async function saveUser() {
    const roles: UserRole[] = [];
    if (roleShutterManager) {
      roles.push(UserRole.ShuttersProgrammer);
    }
    if (roleUserManager) {
      roles.push(UserRole.UserManager);
    }

    const addUserRequest: IAddUserRequest = {
      email,
      password: password1,
      roles: roles,
    };
    try {
      await addUser(addUserRequest);
      setSnackbarProps({
        message: `The user ${email} has been successfully added.`,
        severity: "success",
      });
      setIsUserAdded(true);
    } catch (error: unknown) {
      console.error(
        "AddUserPage: while  trying to ass a user, got error : ",
        error,
      );
      setSnackbarProps({
        message: `Unable to add user ${email} into the application.`,
        severity: "error",
      });
    }
  }

  const canSaveUser =
    emailErrorText === undefined &&
    password1ErrorText === undefined &&
    password2ErrorText === undefined;

  return (
    <GeneralLayout>
      <TitleComponent title="Add a user" />
      <Typography variant="body1">User email :</Typography>
      <TextField
        value={email}
        error={emailErrorText !== undefined}
        helperText={emailErrorText}
        type="email"
        onChange={(e) => updateEmail(e.target.value || "")}
      />
      <Typography variant="body1">Password :</Typography>
      <TextField
        value={password1}
        error={password1ErrorText !== undefined}
        helperText={password1ErrorText}
        type="password"
        onChange={(e) => updatePassword1(e.target.value || "")}
      />
      <Typography variant="body1">Confirm password :</Typography>
      <TextField
        value={password2}
        error={password2ErrorText !== undefined}
        helperText={password2ErrorText}
        type="password"
        onChange={(e) => updatePassword2(e.target.value || "")}
      />
      <FormGroup>
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
      <Grid container>
        <Grid sx={{ mr: 3 }}>
          <Button
            disabled={!canSaveUser}
            onClick={saveUser}
            variant="contained"
          >
            Add user
          </Button>
        </Grid>
        <Grid>
          <Button
            onClick={() => navigate("/users-management")}
            variant="contained"
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
      <Dialog open={isUserAdded}>
        <DialogTitle>User added</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The user {email} has been successfully added in the application.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate("/users-management")}>Close</Button>
        </DialogActions>
      </Dialog>
      <SnackbarComponent />
    </GeneralLayout>
  );
};
