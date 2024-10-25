import { useEffect, useContext, useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { AuthContext } from "../contexts/AuthContext.jsx";
import dialogBox from "../utils/dialogBox.js";
import Swal from "sweetalert2";

const MangaListPage = () => {
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
      console.error("Échec de la récupération des mangas", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await dialogBox(
      "Confirmation de suppression",
      "Voulez-vous vraiment supprimer ce manga"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete(`/admin/mangas/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire("Supprimé", "Manga supprimé avec succès !", "success");
        fetchMangas();
      } catch (error) {
        console.error("Échec de la suppression du manga", error);
        Swal.fire("Erreur", "Erreur lors de la suppression du manga", "error");
      }
    } else {
      Swal.fire("Annulé", "Suppression annulée", "info");
    }
  };

  const handleDeleteChapter = async (mangaId, chapterId) => {
    const confirmed = await dialogBox(
      "Confirmation de suppression",
      "Voulez-vous vraiment supprimer ce chapitre ?"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete(
          `/admin/mangas/${mangaId}/chapters/${chapterId}`
        ),
          {
            headers: { Authorization: `Bearer ${token}` }
          };
        Swal.fire("Supprimé", "Chapitre supprimé avec succès !", "success");
        fetchMangas();
      } catch (error) {
        console.error("Échec de la suppression du chapitre", error);
        Swal.fire("Annulé", "Suppression annulée", "info");
      }
    }
  };

  return (
    <div>
      <h2>Liste des Mangas</h2>
      <ul>
        {mangas.map((manga) => (
          <li key={manga._id}>
            <img src={manga.coverImage} alt={`Couverture de ${manga.title}`} />
            <h4>{manga.title}</h4>
            <p>
              <strong>Auteur: </strong>
              {manga.author}
            </p>
            <p>
              <strong>Genre: </strong>
              {manga.genre}
            </p>
            <p>
              <strong>État: </strong>
              {manga.status}
            </p>
            <button
              onClick={() => {
                console.log(manga);
                handleDelete(manga._id);
              }}
            >
              Supprimer
            </button>
            <>
              <strong>Chapitres:</strong>
              <ul>
                {manga.chapters.map((chapter) => {
                  console.log(chapter);
                  return (
                    <li key={chapter._id}>
                      <p>{chapter.title}</p>{" "}
                      <button
                        onClick={() =>
                          handleDeleteChapter(manga._id, chapter._id)
                        }
                      >
                        del
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MangaListPage;
