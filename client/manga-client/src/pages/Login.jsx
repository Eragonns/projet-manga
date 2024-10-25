import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
      console.log("redirection en fonction du role: ", user.role);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  return (
    <div className="login_container">
      <form onSubmit={handleSubmit} className="login_form">
        <div>
          <input
            type="email"
            placeholder="Email:"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login_input"
            aria-label="email"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Mot de passe:"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login_input"
            aria-label="Mot de passe"
            required
          />
        </div>
        <button type="submit" className="login_btn">
          Se Connecter
        </button>
      </form>
    </div>
  );
};

export default Login;
