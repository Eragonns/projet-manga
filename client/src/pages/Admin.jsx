import { useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../contexts/AuthContext";
import AddMangaForm from "../components/AddMangaForm";
import AddChapterForm from "../components/AddChapterForm";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import MangaListPage from "../components/MangaList";
import EditMangaForm from "../components/EditMangaForm";

const Admin = () => {
  const { token } = useContext(AuthContext);
  const [mangas, setMangas] = useState([]);
  const [editManga, setEditManga] = useState(null);

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
  const handleUpdateManga = async (updateData) => {
    try {
      await axiosInstance.put(
        `/admin/mangas/${updateData.get("_id")}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      fetchMangas();
      setEditManga(null);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Échec de la mise à jour du manga."
      );
      console.error("Erreur lors de la mise à jour du manga :", error);
    }
  };

  return (
    <div className="admin_container">
      <h3 className="admin_title">Gestion des Mangas</h3>
      <Carousel showThumbs={false} infiniteLoop className="admin_carousel">
        <div>
          <h3 className="admin_formTitle">Ajouter un Manga</h3>
          <AddMangaForm fetchMangas={fetchMangas} token={token} />
        </div>
        <div className="admin_carousel_container">
          <h3 className="admin_formTitle">Ajouter un Chapitre</h3>
          <AddChapterForm
            mangas={mangas}
            fetchMangas={fetchMangas}
            token={token}
          />
        </div>
        <div>
          <h3 className="admin_formTitle">Sélectionnez un manga à modifier</h3>
          <EditMangaForm
            editManga={editManga}
            handleUpdateManga={handleUpdateManga}
            setEditManga={setEditManga}
            mangas={mangas}
          />
        </div>
        <div>
          <h3 className="admin_formTitle">Liste des Mangas</h3>
          <MangaListPage
            fetchMangas={fetchMangas}
            setEditManga={setEditManga}
          />
        </div>
      </Carousel>
    </div>
  );
};

export default Admin;
