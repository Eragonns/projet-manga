import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";
import PropTypes from "prop-types";

const AuthRedirect = () => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/register" replace />;
  }

  return <Outlet />;
};

function RoleRedirect({ disallowedRole, redirectTo, children }) {
  const { user } = useContext(AuthContext);

  if (user?.role === disallowedRole) {
    return <Navigate to={redirectTo} />;
  }

  return children;
}

RoleRedirect.propTypes = {
  disallowedRole: PropTypes.string.isRequired,
  redirectTo: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export { AuthRedirect, RoleRedirect };
