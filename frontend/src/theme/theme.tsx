import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    // Name of the component
    MuiCardHeader: {
      styleOverrides: {
        // Name of the slot
        title: {
          // Some CSS
          fontSize: "1.2rem",
        },
      },
    },
  },
});
