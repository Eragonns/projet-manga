import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";

import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";
function BurgerBtn() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext) || [];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <div className={`burgerBtn_menu ${isOpen ? "open" : ""}`}>
        <div
          className={`burgerBtn_icon ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <FaBars className="burgerBtn_reactIcon" />
        </div>
        <div className={`burgerBtn_links ${isOpen ? "open" : ""}`}>
          <div className="burgerBtn_close" onClick={toggleMenu}></div>
          <ImCross className="burgerBtn_close_icon" onClick={toggleMenu} />{" "}
          <div className="burgerBtn_container">
            <h1 className="burgerBtn_title">ScanMangaVerse</h1>
            <ul className="burgerBtn_liens">
              <li>
                <NavLink to="/" className="burgerBtn_lien" onClick={toggleMenu}>
                  Catalogue
                </NavLink>
              </li>
              {user && user.role !== "admin" && (
                <li>
                  <NavLink
                    to="/profile"
                    className="BurgerBtn_lien"
                    onClick={toggleMenu}
                  >
                    profil
                  </NavLink>
                </li>
              )}

              {user ? (
                <>
                  {user.role === "admin" && (
                    <li>
                      <NavLink
                        to="/admin"
                        className="burgerBtn_lien"
                        onClick={toggleMenu}
                      >
                        Admin
                      </NavLink>
                    </li>
                  )}
                  <li>
                    <button onClick={logout} className="burgerBtn_links_logout">
                      Déconnexion
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/login"
                      className="burgerBtn_lien"
                      onClick={toggleMenu}
                    >
                      Connexion
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/register"
                      className="burgerBtn_lien"
                      onClick={toggleMenu}
                    >
                      Inscription
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
export default BurgerBtn;
