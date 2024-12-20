import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
      alert("Échec de la connexion. Veuillez vérifier vos identifiants.");
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  return (
    <div className="login_container">
      <h2 className="login_title">Connexion</h2>
      <form onSubmit={handleSubmit} className="login_form">
        <div>
          <label htmlFor="email" className="sr-only"></label>
          <input
            type="email"
            placeholder="Email:"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login_input"
            aria-label="email"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only"></label>
          <input
            type="password"
            placeholder="Mot de passe:"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login_input"
            aria-label="Mot de passe"
            required
          />
        </div>
        <button
          type="submit"
          className="login_btn"
          aria-label="boutton de connexion"
        >
          Se Connecter
        </button>
      </form>
      <p className="login_registerLink">
        Vous ne possédez pas de compte ?{" "}
        <Link to="/register" className="login_registerLink_link">
          Créer un compte
        </Link>
      </p>
    </div>
  );
};

export default Login;
