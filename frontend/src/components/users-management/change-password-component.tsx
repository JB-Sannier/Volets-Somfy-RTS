import { TextField, Typography } from "@mui/material";
import React, { useState } from "react";

const ERR_PASSWORD_EMPTY = "Password is required.";
const ERR_PASSWORD_MISMATCH = "Passwords don't match.";

export interface IChangePasswordProps {
  passwordUpdated: (newPassword: string, valid: boolean) => void;
}

export const ChangePasswordComponent: React.FC<IChangePasswordProps> = (
  props,
) => {
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");

  const [password1ErrorText, setPassword1ErrorText] = useState<
    string | undefined
  >(ERR_PASSWORD_EMPTY);
  const [password2ErrorText, setPassword2ErrorText] = useState<
    string | undefined
  >(ERR_PASSWORD_EMPTY);

  function updatePassword1(value: string) {
    setPassword1(value);
    if (value === "") {
      setPassword1ErrorText(ERR_PASSWORD_EMPTY);
      props.passwordUpdated("", false);
      return;
    } else if (value !== password2 && password2 !== "") {
      setPassword1ErrorText(ERR_PASSWORD_MISMATCH);
      setPassword2ErrorText(ERR_PASSWORD_MISMATCH);
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
      setPassword2ErrorText(ERR_PASSWORD_EMPTY);
      props.passwordUpdated("", false);
      return;
    } else if (value !== password1 && password1 !== "") {
      setPassword1ErrorText(ERR_PASSWORD_MISMATCH);
      setPassword2ErrorText(ERR_PASSWORD_MISMATCH);
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
    </>
  );
};
