import { Box, Stack, Typography } from "@mui/material";
import React, { type PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

export const LoginLayout: React.FC<PropsWithChildren> = (props) => {
  const { t } = useTranslation("login-layout");

  return (
    <Box
      sx={{
        display: "flex",
        placeItems: "center",
        minHeight: "100vh",
      }}
    >
      <Stack
        sx={{ alignItems: "center", width: "100%", justifyContent: "center" }}
      >
        <Box sx={{ width: "100%", textAlign: "center" }}>
          <Typography variant="h2">{t("SomfyRtsShutters")}</Typography>
        </Box>

        <Box
          sx={{
            p: 3,
            m: 3,
            height: 200,
            verticalAlign: "middle",
          }}
        >
          {props.children}
        </Box>
      </Stack>
    </Box>
  );
};
