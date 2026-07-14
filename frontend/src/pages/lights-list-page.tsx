import React, { useEffect } from "react";
import { GeneralLayout } from "../layouts/general-layout";
import { LightsListComponent } from "../components/lights-operations/lights-list-component";
import { useAuthContext } from "../contexts/auth-context.types";
import { UserRole } from "../services/users-service.types";
import { useNavigate } from "react-router-dom";

export const LightsListPage: React.FC = () => {
  const authContext = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authContext.hasRole(UserRole.LightsUser)) {
      navigate("/");
    }
  }, []);

  return (
    <GeneralLayout>
      <LightsListComponent />
    </GeneralLayout>
  );
};
