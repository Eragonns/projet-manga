import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(pseudo, email, password);
    } catch (error) {
      console.error(error);
      alert("Échec de l'inscription. Veuillez réessayer.");
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
    <div className="register_container">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit} className="register_form">
        <div>
          <input
            type="text"
            value={pseudo}
            placeholder="Pseudo:"
            onChange={(e) => setPseudo(e.target.value)}
            className="register_input"
            aria-label="pseudo"
            required
          />
        </div>
        <div>
          <input
            type="email"
            value={email}
            placeholder="Email:"
            onChange={(e) => setEmail(e.target.value)}
            className="register_input"
            aria-label="email"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            placeholder="Mot de passe:"
            onChange={(e) => setPassword(e.target.value)}
            className="register_input"
            aria-label="Mot de passe"
            required
          />
        </div>
        <button type="submit" className="register_btn">
          S&apos;inscrire
        </button>
      </form>
    </div>
  );
};

export default Register;
