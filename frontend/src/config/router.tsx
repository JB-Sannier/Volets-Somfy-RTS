import { createBrowserRouter } from "react-router-dom";
import { AddShutterPage } from "../pages/add-shutter-page";
import { AddUserPage } from "../pages/add-user-page";
import { ErrorPage } from "../pages/error-page";
import { LoginPage } from "../pages/login-page";
import { ModifyUserPage } from "../pages/modify-user-page";
import { ShuttersManagementPage } from "../pages/shutters-management-page";
import { UsersManagementPage } from "../pages/users-management-page";
import { WelcomePage } from "../pages/welcome-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: WelcomePage,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    Component: LoginPage,
    errorElement: <ErrorPage />,
  },
  {
    path: "/shutters-management",
    Component: ShuttersManagementPage,
    errorElement: <ErrorPage />,
  },
  {
    path: "/add-shutter",
    Component: AddShutterPage,
    errorElement: <ErrorPage />,
  },
  {
    path: "/users-management",
    Component: UsersManagementPage,
    errorElement: <ErrorPage />,
  },
  {
    path: "/users-management/modify-user/:email",
    element: <ModifyUserPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/users-management/add-user",
    Component: AddUserPage,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    loader: () => {
      // any unmatched URL should trigger a 404 response captured by ErrorPage
      throw new Response("Not Found", { status: 404 });
    },
    errorElement: <ErrorPage />,
  },
]);
