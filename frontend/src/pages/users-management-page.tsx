import React, { useState, useEffect } from "react";
import {
  type IListUsersResponse,
  type IUserResponse,
  UserRole,
} from "../services/users-service.types";
import {
  callWithRemoteData,
  REMOTE_DATA_INIT,
  type RemoteData,
  RemoteDataStatus,
} from "../services/remote-data";
import { useUserApis } from "../services/users-service";
import { useAuthContext } from "../contexts/auth-context.types";
import { useNavigate } from "react-router-dom";
import { GeneralLayout } from "../layouts/general-layout";
import { UserComponent } from "../components/users-management/user-component";
import { useSnackbar } from "../components/snackbar-component";
import { TitleComponent } from "../components/title-component";
import { useTranslation } from "react-i18next";

export const UsersManagementPage: React.FC = () => {
  const authContext = useAuthContext();
  const navigate = useNavigate();
  const userApis = useUserApis();
  const { t } = useTranslation("user-management-page");
  const { setSnackbarProps, SnackbarComponent } = useSnackbar();

  const [users, setUsers] = useState<IUserResponse[]>([]);
  const [listUsersRD, setListUsersRD] =
    useState<RemoteData<IListUsersResponse>>(REMOTE_DATA_INIT);

  useEffect(() => {
    if (listUsersRD.status === RemoteDataStatus.Init) {
      callWithRemoteData(userApis.listUsers, undefined, (newRd) =>
        setListUsersRD(newRd),
      );
    } else if (listUsersRD.status === RemoteDataStatus.Loaded) {
      setUsers(listUsersRD.payload);
    }
  }, [listUsersRD, userApis.listUsers]);

  if (!authContext.hasRole(UserRole.UserManager)) {
    navigate("/");
  }

  function changeUser(u: IUserResponse, index: number) {
    const newUsers = [...users];
    newUsers[index] = u;
    setUsers(newUsers);
    setSnackbarProps({
      message: t("MessageUserModifiedSuccessfully"),
      severity: "success",
    });
  }

  function removeUser(user: IUserResponse) {
    const newUsers = [...users].filter((u) => u.email !== user.email);
    setUsers(newUsers);
    setSnackbarProps({
      message: t("MessageUserDeletedSuccessfully", { email: user.email }),
      severity: "success",
    });
  }

  return (
    <GeneralLayout>
      {authContext.hasRole(UserRole.UserManager) && (
        <>
          <TitleComponent title={t("Title")} />
          {users.map((u, index) => (
            <UserComponent
              user={u}
              key={index}
              onUserModified={(u) => changeUser(u, index)}
              onUserDeleted={(u) => removeUser(u)}
            />
          ))}
        </>
      )}
      <SnackbarComponent />
    </GeneralLayout>
  );
};
