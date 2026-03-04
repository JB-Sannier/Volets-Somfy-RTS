import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { GeneralLayout } from "../layouts/general-layout";

export const ErrorPage: React.FC = () => {
  const error = useRouteError();
  let message = "An unexpected error has occurred.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      message = "Page not found (404).";
    } else {
      message = `Error ${error.status}: ${error.statusText}`;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <GeneralLayout>
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Oops!</h1>
        <p>{message}</p>
      </div>
    </GeneralLayout>
  );
};
