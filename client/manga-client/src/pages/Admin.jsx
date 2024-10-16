import { useState, useEffect, useContext } from "react";

import axiosInstance from "../utils/axiosInstance.js";
import { AuthContext } from "../contexts/AuthContext.jsx";

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
  const [chapterData, setChapterData] = useState({
    mangaId: "",
    title: "",
    images: []
  });

  useEffect(() => {
    fetchMangas();
  }, []);

  const fetchMangas = async () => {
    try {
      const response = await axiosInstance.get("/admin/mangas", {
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

  const handleChapterChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "chapterImages") {
      setChapterData((prev) => ({ ...prev, images: files }));
    } else {
      setChapterData((prev) => ({ ...prev, [name]: value }));
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
      data.append("images", formData.images[i]);
    }

    try {
      await axiosInstance.post("/admin/mangas", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Manga ajouté avec succès !");
      fetchMangas();
      setFormData({
        title: "",
        author: "",
        genre: "",
        status: "En Cours",
        images: []
      });
    } catch (error) {
      console.error(error);
      alert("Échec de l'ajout du manga.");
    }
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", chapterData.title);

    const selectedManga = mangas.find((m) => m._id === chapterData.mangaId);
    data.append("mangaTitle", selectedManga ? selectedManga.title : "");
    for (let i = 0; i < chapterData.images.length; i++) {
      data.append("images", chapterData.images[i]);
    }

    try {
      await axiosInstance.post(
        `/admin/mangas/${chapterData.mangaId}/chapters`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      alert("Chapitre ajouté avec succès !");
      fetchMangas();
      setChapterData({
        mangaId: "",
        title: "",
        images: []
      });
    } catch (error) {
      console.error(error);
      alert("Échec de l'ajout du chapitre");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce manga ?")) return;
    try {
      await axiosInstance.delete(`/admin/mangas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Manga supprimé avec succès !");
      fetchMangas();
    } catch (error) {
      console.error(error);
      alert("Échec de la suppression du manga.");
    }
  };

  const handleDeleteChapter = async (mangaId, chapterId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce chapitre ?")) return;
    try {
      await axiosInstance.delete(
        `/admin/mangas/${mangaId}/chapters/${chapterId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert("Chapitre supprimé avec succès !");
      fetchMangas();
    } catch (error) {
      console.error(error);
      alert("Échec de la suppression du chapitre");
    }
  };

  return (
    <div className="admin_container">
      <h2>Administration des Mangas</h2>
      <form onSubmit={handleAddManga}>
        <h3>Ajouter un Nouveau Manga</h3>
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

      <form onSubmit={handleAddChapter}>
        <h3>Ajouter un Chapitre à un Manga</h3>
        <div>
          <label>Manga:</label>
          <select
            name="mangaId"
            value={chapterData.mangaId}
            onChange={(e) =>
              setChapterData({ ...chapterData, mangaId: e.target.value })
            }
            required
          >
            <option value="">Sélectionner un Manga</option>
            {mangas.map((manga) => (
              <option key={manga._id} value={manga._id}>
                {manga.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Titre du Chapitre:</label>
          <input
            type="text"
            name="title"
            value={chapterData.title}
            onChange={handleChapterChange}
            required
          />
        </div>
        <div>
          <label>Images du Chapitre:</label>
          <input
            type="file"
            name="chapterImages"
            multiple
            accept="image/*"
            onChange={handleChapterChange}
          />
        </div>
        <button type="submit">Ajouter Chapitre</button>
      </form>

      <h3>Liste des Mangas</h3>
      <ul>
        {mangas.map((manga) => (
          <li key={manga._id}>
            <h4>{manga.title}</h4>
            <p>Auteur: {manga.author}</p>
            <p>Genre: {manga.genre}</p>
            <p>Statut: {manga.status}</p>
            <button onClick={() => handleDelete(manga._id)}>
              Supprimer Manga
            </button>
            <ul>
              {manga.chapters.map((chapter) => (
                <li key={chapter._id}>
                  <h5>{chapter.title}</h5>
                  <div>
                    {chapter.images.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`${chapter.title} ${index + 1}`}
                        width="100"
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => handleDeleteChapter(manga._id, chapter._id)}
                  >
                    Supprimer Chapitre
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
