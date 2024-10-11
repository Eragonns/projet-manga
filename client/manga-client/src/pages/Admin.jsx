import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const Admin = () => {
  const { token } = useContext(AuthContext);
  const [mangas, setMangas] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    status: "En Cours",
    images: []
  });

  useEffect(() => {
    fetchMangas();
  }, []);

  const fetchMangas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/mangas", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMangas(response.data.mangas);
    } catch (error) {
      console.error(error);
      alert("Échec de la récupération des mangas.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData((prev) => ({ ...prev, images: files }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddManga = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("genre", formData.genre);
    data.append("status", formData.status);
    for (let i = 0; i < formData.images.length; i++) {
      data.append("manga", formData.images[i]);
    }

    try {
      await axios.post("http://localhost:5000/api/v1/admin/mangas", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Manga ajouté avec succès !");
      fetchMangas();
    } catch (error) {
      console.error(error);
      alert("Échec de l'ajout du manga.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce manga ?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/mangas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Manga supprimé avec succès !");
      fetchMangas();
    } catch (error) {
      console.error(error);
      alert("Échec de la suppression du manga.");
    }
  };

  return (
    <div className="admin-container">
      <h2>Administration des Mangas</h2>
      <form onSubmit={handleAddManga}>
        <div>
          <label>Titre:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Auteur:</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Genre:</label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Statut:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="En Cours">En Cours</option>
            <option value="Terminé">Terminé</option>
          </select>
        </div>
        <div>
          <label>Images:</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <button type="submit">Ajouter Manga</button>
      </form>

      <h3>Liste des Mangas</h3>
      <ul>
        {mangas.map((manga) => (
          <li key={manga._id}>
            <h4>{manga.title}</h4>
            <p>Auteur: {manga.author}</p>
            <p>Genre: {manga.genre}</p>
            <p>Statut: {manga.status}</p>
            <button onClick={() => handleDelete(manga._id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
