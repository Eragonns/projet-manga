import { NavLink } from "react-router-dom";
import BurgerBtn from "./BurgerBtn";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
function Navbar() {
  const { user, logout } = useContext(AuthContext) || [];
  return (
    <nav className="navbar">
      <div>
        <NavLink to="/">
          <img
            src="/logo-site-manga.jfif"
            alt="Logo du site"
            className="navbar_logo"
          />
        </NavLink>
      </div>
      <h1 className="navbar_title">ScanMangaVerse</h1>
      <ul className="navbar_liens">
        <li>
          <NavLink to="/" className="navbar_lien">
            Catalogue
          </NavLink>
        </li>
        {user && user.role !== "admin" && (
          <li>
            <NavLink to="/profile" className="navbar_lien">
              profil
            </NavLink>
          </li>
        )}

        {user ? (
          <>
            {user.role === "admin" && (
              <li>
                <NavLink to="/admin" className="navbar_lien">
                  Admin
                </NavLink>
              </li>
            )}
            <li>
              <button onClick={logout} className="navbar_links_logout">
                Déconnexion
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login" className="navbar_lien">
                Connexion
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className="navbar_lien">
                Inscription
              </NavLink>
            </li>
          </>
        )}
      </ul>
      <BurgerBtn />
    </nav>
  );
}

export default Navbar;
