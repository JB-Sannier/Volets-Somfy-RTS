import { Alert, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";

interface ISnackbarProps {
  message: string;
  severity: "error" | "info" | "success" | "warning";
}

export const useSnackbar = () => {
  const [snackbarProps, setSnackbarProps] = useState<ISnackbarProps>({
    message: "",
    severity: "info",
  });

  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (snackbarProps.message !== "") {
      setOpen(true);
    }
  }, [snackbarProps, setOpen]);

  const SnackbarComponent: React.FC = () => {
    return (
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => {
          setOpen(false);
          setSnackbarProps({
            message: "",
            severity: "info",
          });
        }}
      >
        <Alert
          onClose={() => {
            setOpen(false);
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
