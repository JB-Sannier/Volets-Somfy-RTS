import { Alert, Snackbar } from "@mui/material";
import React, { useState } from "react";

interface ISnackbarProps {
  message: string;
  severity: "error" | "info" | "success" | "warning";
}

export const useSnackbar = () => {
  const [snackbarProps, setSnackbarProps] = useState<ISnackbarProps>({
    message: "",
    severity: "info",
  });

  const isOpen = snackbarProps.message !== "";

  const SnackbarComponent: React.FC = () => {
    return (
      <Snackbar
        open={isOpen}
        autoHideDuration={2000}
        onClose={() => {
          setSnackbarProps({
            message: "",
            severity: "info",
          });
        }}
      >
        <Alert
          onClose={() => {
            setSnackbarProps({
              message: "",
              severity: "info",
            });
          }}
          severity={snackbarProps.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarProps.message}
        </Alert>
      </Snackbar>
    );
  };

  return { SnackbarComponent, setSnackbarProps };
};
