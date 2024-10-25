import { useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../contexts/AuthContext";
import AddMangaForm from "../components/AddMangaForm";
import AddChapterForm from "../components/AddChapterForm";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import MangaListPage from "../components/MangaList";

const Admin = () => {
  const { token } = useContext(AuthContext);
  const [mangas, setMangas] = useState([]);

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

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Voulez-vous vraiment supprimer ce manga ?")) return;
  //   try {
  //     await axiosInstance.delete(`/admin/mangas/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     alert("Manga supprimé avec succès !");
  //     fetchMangas();
  //   } catch (error) {
  //     console.error(error);
  //     alert("Échec de la suppression du manga.");
  //   }
  // };

  return (
    <div className="admin_container">
      <h3 className="admin_title">Gestion des Mangas</h3>
      <Carousel showThumbs={false} infiniteLoop className="admin_carousel">
        <div>
          <h3 className="admin_carousel_title">Ajouter un Manga</h3>
          <AddMangaForm fetchMangas={fetchMangas} token={token} />
        </div>
        <div className="admin_carousel_container">
          <h3 className="admin_carousel_title ">Ajouter un Chapitre</h3>
          <AddChapterForm
            mangas={mangas}
            fetchMangas={fetchMangas}
            token={token}
          />
        </div>
        <div>
          <MangaListPage />
        </div>
      </Carousel>
    </div>
  );
};

export default Admin;
