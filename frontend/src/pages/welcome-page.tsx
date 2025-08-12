import React, { useEffect, type PropsWithChildren } from "react";
import { useAuthContext } from "../contexts/auth-context.types";
import { useNavigate } from "react-router-dom";
import { GeneralLayout } from "../layouts/general-layout";
import { ShuttersListComponent } from "../components/shutters-operations/shutters-list-component";

export const WelcomePage: React.FC<PropsWithChildren> = (props) => {
  const authContext = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authContext.isLoggedIn()) {
      navigate("/login");
    }
  }, [authContext, navigate]);

  return (
    <>
      {authContext.isLoggedIn() && (
        <GeneralLayout>
          <ShuttersListComponent />
          {props.children}
        </GeneralLayout>
      )}
    </>
  );
};
