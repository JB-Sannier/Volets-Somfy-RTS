import "./App.css";
import { AuthContextProvider } from "./contexts/auth-context";
import { RouterProvider } from "react-router-dom";
import { router } from "./config/router";
import "./config/axios";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";
import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";

declare const BACKEND_URL: string;

console.log("BACKEND_URL :", BACKEND_URL);

const ApplicationTitleComponent: React.FC = () => {
  const { t } = useTranslation("app");
  useEffect(() => {
    document.title = t("Title");
  }, [t]);
  return <></>;
};

function App() {
  return (
    <>
      <Suspense fallback={<></>}>
        <ApplicationTitleComponent />
        <AuthContextProvider>
          <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </AuthContextProvider>
      </Suspense>
    </>
  );
}

export default App;
