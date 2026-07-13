import React, { useEffect } from "react";
import { GeneralLayout } from "../layouts/general-layout";
import { TitleComponent } from "../components/title-component";
import { useTranslation } from "react-i18next";
import { LightsManagementListComponent } from "../components/lights-management/lights-mgmt-list-component";
import { useAuthContext } from "../contexts/auth-context.types";
import { UserRole } from "../services/users-service.types";
import { useNavigate } from "react-router-dom";

export const LightsManagementPage: React.FC = () => {
  const { t } = useTranslation("lights-management-page");
  const authContext = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (!authContext.hasRole(UserRole.LightsProgrammer)) {
      console.log("User without LightsProgrammer role => out");
      navigate("/");
    }
  }, []);

  return (
    <GeneralLayout>
      {authContext.hasRole(UserRole.LightsProgrammer) ? (
        <>
          <TitleComponent title={t("Title")} />
          <LightsManagementListComponent />
        </>
      ) : (
        <></>
      )}
    </GeneralLayout>
  );
};
