import { NavLink } from "react-router-dom";
import BurgerBtn from "./BurgerBtn";

function Navbar() {
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

      <BurgerBtn />
    </nav>
  );
}

export default Navbar;
