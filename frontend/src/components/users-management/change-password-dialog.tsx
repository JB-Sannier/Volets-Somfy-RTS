import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import { ChangePasswordComponent } from "./change-password-component";

export interface IChangePasswordDialogProps {
  open: boolean;
  passwordUpdated: (newPassword: string) => void;
  passwordUpdateCancelled: () => void;
}

export const ChangePasswordDialog: React.FC<IChangePasswordDialogProps> = (
  props,
) => {
  const [password, setPassword] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);

  function passwordUpdated(newPassword: string, newIsValid: boolean) {
    setPassword(newPassword);
    setIsValid(newIsValid);
  }

  function onUpdatePassword() {
    props.passwordUpdated(password);
  }

  function onCancel() {
    props.passwordUpdateCancelled();
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>Change password</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please, fill the password you want to assign for this user:
        </DialogContentText>
        <ChangePasswordComponent passwordUpdated={passwordUpdated} />
      </DialogContent>
      <DialogActions>
        <Button disabled={!isValid} onClick={onUpdatePassword}>
          Update password
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
