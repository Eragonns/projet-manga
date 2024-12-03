import { useRouteError } from "react-router";
import { NavLink } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  console.log("erreur ", error);

  const isNotFound = error?.status === 404 || error?.statusText === "Not Found";

  if (isNotFound) {
    return (
      <section className="errorPage_section">
        <h1 className="errorPage_titre">Erreur 404</h1>
        <NavLink to="/">
          <button className="errorPage_btn">Retour à l&apos;accueil</button>
        </NavLink>
        <img
          src="/Error-404.jfif"
          alt="Page d'erreur 404"
          className="errorPage_img"
        />
      </section>
    );
  }

  return (
    <section className="errorPage_section">
      <h1 className="errorPage_titre">Une erreur s&apos;est produite</h1>
      <p>
        <i>{error?.statusText || error?.message || "Erreur inconnue"}</i>
      </p>
      <NavLink to="/">
        <button className="errorPage_btn">Retour à l&apos;accueil</button>
      </NavLink>
    </section>
  );
}

export default ErrorPage;
