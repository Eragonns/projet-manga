import { useState, useContext, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../contexts/AuthContext";
import AddChapterForm from "../components/AddChapterForm";

const AddChapterPage = () => {
  const { token } = useContext(AuthContext);
  const [mangas, setMangas] = useState([]);
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
      console.error("Échec de la récupération des mangas", error);
    }
  };

  const handleAddChapter = async (formData, e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", chapterData.title);

    const selectedManga = mangas.find((m) => m._id === chapterData.mangaId);
    data.append("mangaTitle", selectedManga ? selectedManga.title : "");
    for (let i = 0; i < chapterData.images.length; i++) {
      data.append("chapitres", chapterData.images[i]);
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

  return (
    <div>
      <h2>Ajouter un Chapitre</h2>
      <AddChapterForm
        mangas={mangas}
        token={token}
        handleAddChapter={handleAddChapter}
      />
    </div>
  );
};

export default AddChapterPage;
