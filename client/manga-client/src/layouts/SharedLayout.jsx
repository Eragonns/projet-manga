import { Outlet, useNavigation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function SharedLayout() {
  const navigation = useNavigation();
  console.log(navigation.state);

  if (navigation.state === "loading") {
    return (
      <main>
        <div className="spinner"></div>
      </main>
    );
  }
  return (
    <div className="page_container">
      <Navbar />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

export default SharedLayout;
