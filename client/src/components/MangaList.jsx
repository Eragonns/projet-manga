import { useEffect, useContext, useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { dialogBox } from "../utils/dialogBox.js";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const MangaListPage = ({ fetchMangas }) => {
  const { token } = useContext(AuthContext);
  const [mangas, setMangas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMangas, setFilteredMangas] = useState([]);

  useEffect(() => {
    const loadMangas = async () => {
      try {
        const response = await axiosInstance.get("/admin/mangas", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMangas(response.data.mangas);
        setFilteredMangas(response.data.mangas);
      } catch (error) {
        console.error("Échec de la récupération des mangas", error);
      }
    };
    loadMangas();
  }, [token]);

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = mangas.filter((manga) =>
      manga.title.toLowerCase().includes(searchValue)
    );
    setFilteredMangas(filtered);
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
        setMangas((prevMangas) =>
          prevMangas.filter((manga) => manga._id !== id)
        );
        setFilteredMangas((prevFilteredMangas) =>
          prevFilteredMangas.filter((manga) => manga._id !== id)
        );
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
        setMangas((prevMangas) =>
          prevMangas.map((manga) =>
            manga._id === mangaId
              ? {
                  ...manga,
                  chapters: manga.chapters.filter(
                    (chapter) => chapter._id !== chapterId
                  )
                }
              : manga
          )
        );
        setFilteredMangas((prevFilteredMangas) =>
          prevFilteredMangas.map((manga) =>
            manga._id === mangaId
              ? {
                  ...manga,
                  chapters: manga.chapters.filter(
                    (chapter) => chapter._id !== chapterId
                  )
                }
              : manga
          )
        );
        Swal.fire("Supprimé", "Chapitre supprimé avec succès !", "success");
        fetchMangas();
      } catch (error) {
        console.error("Échec de la suppression du chapitre", error);
        Swal.fire("Annulé", "Suppression annulée", "info");
      }
    } else {
      Swal.fire("Annulé", "Suppression annulée", "info");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher un manga..."
        value={searchTerm}
        onChange={handleSearch}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          fontSize: "16px"
        }}
      />
      <ul>
        {filteredMangas.map((manga) => (
          <li key={manga._id}>
            <img src={manga.coverImage} alt={`Couverture de ${manga.title}`} />
            <h4>{manga.title}</h4>
            <p>
              <strong>Auteur: </strong>
              {manga.author}
            </p>
            <p>
              <strong>Genre: </strong>
              {manga.genre.join(", ")}
            </p>
            <p>
              <strong>État: </strong>
              {manga.status}
            </p>
            <button
              onClick={() => {
                handleDelete(manga._id);
              }}
            >
              Supprimer ce Manga
            </button>
            <div>
              <strong>Chapitres:</strong>
              <ul>
                {manga.chapters.map((chapter) => (
                  <li key={chapter._id}>
                    <p>{chapter.title}</p>
                    <button
                      onClick={() =>
                        handleDeleteChapter(manga._id, chapter._id)
                      }
                    >
                      Supprimer ce chapitre
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

MangaListPage.propTypes = {
  fetchMangas: PropTypes.func
};

export default MangaListPage;
