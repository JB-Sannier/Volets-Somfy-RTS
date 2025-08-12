import "./App.css";
import SwaggerUi from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

function App() {
  return (
    <>
      <SwaggerUi url="/swagger.yml" />
    </>
  );
}

export default App;
