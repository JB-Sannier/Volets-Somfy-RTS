import "./App.css";
import { AuthContextProvider } from "./contexts/auth-context";
import { RouterProvider } from "react-router-dom";
import { router } from "./config/router";
import "./config/axios";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";

function App() {
  return (
    <>
      <AuthContextProvider>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;
