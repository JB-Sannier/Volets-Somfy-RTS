import { TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export interface IChangePasswordProps {
  passwordUpdated: (newPassword: string, valid: boolean) => void;
}

export const ChangePasswordComponent: React.FC<IChangePasswordProps> = (
  props,
) => {
  const { t } = useTranslation("change-password-component");
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");

  const [password1ErrorText, setPassword1ErrorText] = useState<
    string | undefined
  >(t("ErrPasswordEmpty"));
  const [password2ErrorText, setPassword2ErrorText] = useState<
    string | undefined
  >(t("ErrPasswordEmpty"));

  function updatePassword1(value: string) {
    setPassword1(value);
    if (value === "") {
      setPassword1ErrorText(t("ErrPasswordEmpty"));
      props.passwordUpdated("", false);
      return;
    } else if (value !== password2 && password2 !== "") {
      setPassword1ErrorText(t("ErrPasswordMismatch"));
      setPassword2ErrorText(t("ErrPasswordMismatch"));
      props.passwordUpdated("", false);
      return;
    }
    if (value !== "" && password2 !== "" && value === password2) {
      setPassword2ErrorText(undefined);
      props.passwordUpdated(value, true);
    }
    setPassword1ErrorText(undefined);
    props.passwordUpdated(value, value === password2);
  }

  function updatePassword2(value: string) {
    setPassword2(value);

    if (value === "") {
      setPassword2ErrorText(t("ErrPasswordEmpty"));
      props.passwordUpdated("", false);
      return;
    } else if (value !== password1 && password1 !== "") {
      setPassword1ErrorText(t("ErrPasswordMismatch"));
      setPassword2ErrorText(t("ErrPasswordMismatch"));
      props.passwordUpdated("", false);
      return;
    }
    if (value !== "" && password1 !== "" && value === password1) {
      setPassword1ErrorText(undefined);
      props.passwordUpdated(value, true);
    }
    setPassword2ErrorText(undefined);
    props.passwordUpdated(value, value === password1);
  }

  return (
    <>
      <Typography variant="body1">{t("Password")}</Typography>
      <TextField
        value={password1}
        error={password1ErrorText !== undefined}
        helperText={password1ErrorText}
        type="password"
        onChange={(e) => updatePassword1(e.target.value || "")}
      />
      <Typography variant="body1">{t("ConfirmPassword")}</Typography>
      <TextField
        value={password2}
        error={password2ErrorText !== undefined}
        helperText={password2ErrorText}
        type="password"
        onChange={(e) => updatePassword2(e.target.value || "")}
      />
    </>
  );
};
