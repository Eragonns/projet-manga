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
    <div className="login-container">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Se Connecter</button>
      </form>
    </div>
  );
};

export default Login;
