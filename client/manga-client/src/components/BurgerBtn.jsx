import { useState } from "react";
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars } from "@fortawesome/free-solid-svg-icons";

function BurgerBtn() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <div className={`burgerBtn_menu ${isOpen ? "open" : ""}`}>
        <div
          className={`burgerBtn_icon ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <FontAwesomeIcon icon={faBars} size="2x" />
        </div>
        <div className={`burgerBtn_links ${isOpen ? "open" : ""}`}>
          <div className="burgerBtn_close" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faXmark} size="2x" />
          </div>
          <ul>
            <li>
              <NavLink to="/catalogue" onClick={toggleMenu}>
                Catalogue
              </NavLink>
            </li>
            <li>
              <NavLink to="/connexion" onClick={toggleMenu}>
                Connexion
              </NavLink>
            </li>
            <li>
              <NavLink to="/inscription" onClick={toggleMenu}>
                S&apos;inscrire
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
export default BurgerBtn;
