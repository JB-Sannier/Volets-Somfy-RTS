import { createBrowserRouter } from "react-router-dom";
import { WelcomePage } from "../pages/welcome-page";
import { LoginPage } from "../pages/login-page";
import { ShuttersManagementPage } from "../pages/shutters-management-page";
import { AddShutterPage } from "../pages/add-shutter-page";
import { UsersManagementPage } from "../pages/users-management-page";
import { AddUserPage } from "../pages/add-user-page";
import { ModifyUserPage } from "../pages/modify-user-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: WelcomePage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/shutters-management",
    Component: ShuttersManagementPage,
  },
  {
    path: "/add-shutter",
    Component: AddShutterPage,
  },
  {
    path: "/users-management",
    Component: UsersManagementPage,
  },
  {
    path: "/users-management/modify-user/:email",
    element: <ModifyUserPage />,
  },
  {
    path: "/users-management/add-user",
    Component: AddUserPage,
  },
]);
