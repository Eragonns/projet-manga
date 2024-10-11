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
    <main>
      <Navbar />
      <Outlet />
    </main>
  );
}

export default SharedLayout;
