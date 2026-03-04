import { ThemeProvider } from "@mui/material";
import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import { ErrorBoundary } from "./components/error-boundary";
import { router } from "./config/router";
import { AuthContextProvider } from "./contexts/auth-context";
import "./services/base-api-calls";
import { theme } from "./theme/theme";

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
            <ErrorBoundary>
              <RouterProvider router={router} />
            </ErrorBoundary>
          </ThemeProvider>
        </AuthContextProvider>
      </Suspense>
    </>
  );
}

export default App;
