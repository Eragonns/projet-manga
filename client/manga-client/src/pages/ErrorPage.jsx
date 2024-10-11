import { useRouteError } from "react-router";
import { Link, NavLink } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();

  if (error.status === 404) {
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
    <section>
      <p>Une erreur s&apos;est produite</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to="/">Retour à l&apos;accueil</Link>
    </section>
  );
}

export default ErrorPage;
