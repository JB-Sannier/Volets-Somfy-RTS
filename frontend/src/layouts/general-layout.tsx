import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import React, { type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/auth-context.types";
import { UserRole } from "../services/users-service.types";
import { useTranslation } from "react-i18next";

import BlindsIcon from "@mui/icons-material/Blinds";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";

export const GeneralLayout: React.FC<PropsWithChildren> = (props) => {
  const navigate = useNavigate();
  const authContext = useAuthContext();
  const { t } = useTranslation("general-layout");

  function handleShuttersManagementClicked() {
    navigate("/shutters-management");
  }

  function handleUsersManagementClicked() {
    navigate("/users-management");
  }

  function logoutClicked() {
    authContext.logout();
    navigate("/");
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            {t("SomfyShutters")}
          </Typography>
          <IconButton
            title={t("Home")}
            onClick={() => navigate("/")}
            color="inherit"
          >
            <HomeIcon />
          </IconButton>
          {authContext.hasRole(UserRole.ShuttersProgrammer) && (
            <IconButton
              title={t("ManageShutters")}
              onClick={handleShuttersManagementClicked}
              color="inherit"
            >
              <BlindsIcon />
            </IconButton>
          )}
          {authContext.hasRole(UserRole.UserManager) && (
            <IconButton
              title={t("ManageUsers")}
              onClick={handleUsersManagementClicked}
              color="inherit"
            >
              <ManageAccountsIcon />
            </IconButton>
          )}
          {authContext.hasRole(UserRole.LightsUser) && (
            <IconButton
              title={t("OperateLights")}
              onClick={() => navigate("/lights-operations")}
              color="inherit"
            >
              <LightbulbIcon />
            </IconButton>
          )}
          {authContext.hasRole(UserRole.LightsProgrammer) && (
            <IconButton
              title={t("ProgramLights")}
              onClick={() => navigate("/lights-management")}
              color="inherit"
            >
              <TipsAndUpdatesIcon />
            </IconButton>
          )}
          <IconButton
            title={t("Logout")}
            onClick={logoutClicked}
            color="inherit"
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ m: 2 }}>{props.children}</Box>
    </>
  );
};
