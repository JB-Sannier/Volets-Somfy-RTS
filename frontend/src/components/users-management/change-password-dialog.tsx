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
import { useTranslation } from "react-i18next";

export interface IChangePasswordDialogProps {
  open: boolean;
  passwordUpdated: (newPassword: string) => void;
  passwordUpdateCancelled: () => void;
}

export const ChangePasswordDialog: React.FC<IChangePasswordDialogProps> = (
  props,
) => {
  const { t } = useTranslation("change-password-dialog");
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
      <DialogTitle>{t("ChangePassword")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("ChangePasswordInstructions")}</DialogContentText>
        <ChangePasswordComponent passwordUpdated={passwordUpdated} />
      </DialogContent>
      <DialogActions>
        <Button disabled={!isValid} onClick={onUpdatePassword}>
          {t("UpdatePassword")}
        </Button>
        <Button onClick={onCancel}>{t("Cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
};
