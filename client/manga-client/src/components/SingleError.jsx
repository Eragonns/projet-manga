import { useRouteError } from "react-router-dom";

function SingleError() {
  const error = useRouteError();
  return <h2>{error.message || "Une erreur est survenue."}</h2>;
}

export default SingleError;
