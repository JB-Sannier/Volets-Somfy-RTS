import React, { useEffect } from "react";
import { LoginLayout } from "../layouts/login-layout";
import { Button, Grid, Paper, TextField } from "@mui/material";
import { useAuthContext } from "../contexts/auth-context.types";
import { useNavigate } from "react-router-dom";

export const LoginPage: React.FC = () => {
  const authContext = useAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  function onSubmit() {
    authContext.loginUser(email, password);
  }

  useEffect(() => {
    if (authContext.isLoggedIn()) {
      navigate("/");
    }
  }, [authContext, navigate]);

  return (
    <>
      <LoginLayout>
        <Paper sx={{ p: 3 }}>
          <Grid container direction="column" spacing={3}>
            <Grid size="grow">
              <TextField
                value={email}
                fullWidth
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid size="grow">
              <TextField
                value={password}
                type="password"
                fullWidth
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid size="grow" alignSelf="center">
              <Button onClick={onSubmit} variant="contained">
                Login
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </LoginLayout>
    </>
  );
};
