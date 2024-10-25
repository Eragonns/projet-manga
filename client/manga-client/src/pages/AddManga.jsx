import { useContext, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../contexts/AuthContext";
import AddMangaForm from "../components/AddMangaForm";

const AddMangaPage = () => {
  const { token } = useContext(AuthContext);
  const [mangas, setMangas] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    status: "En Cours",
    coverImage: "",
    images: []
  });

  const handleAddManga = async (e, formData) => {
    e.preventDefault();
    if (!formData.coverImage || !(formData.coverImage instanceof File)) {
      alert("Veuillez sélectionner une image de couverture valide");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("genre", formData.genre);
    data.append("description", formData.description);
    data.append("status", formData.status);
    data.append("coverImage", formData.coverImage);
    for (let i = 0; i < formData.images.length; i++) {
      data.append("mangas", formData.images[i]);
    }
    console.log("data:", [...data]);

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
        description: "",
        status: "En Cours",
        coverImage: "",
        images: []
      });
    } catch (error) {
      console.error(error);
      alert("Échec de l'ajout du manga.");
    }
  };

  return (
    <div>
      <h2>Ajouter un Manga</h2>
      <AddMangaForm token={token} handleAddManga={handleAddManga} />
    </div>
  );
};

export default AddMangaPage;
