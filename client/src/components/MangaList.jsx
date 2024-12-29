import { useEffect, useContext, useState } from "react";
// import axiosInstance from "../utils/axiosInstance.js";
import axiosRender from "../utils/axiosRender";
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
        const response = await axiosRender.get("/admin/mangas", {
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
        await axiosRender.delete(`/admin/mangas/${id}`, {
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
        await axiosRender.delete(
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
    <div className="mangaList_container">
      <input
        type="text"
        placeholder="Rechercher un manga..."
        className="mangaList_search"
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul className="mangaList_list">
        {filteredMangas.map((manga) => (
          <li
            key={manga._id}
            className={`mangaList_item ${
              manga.chapters.length > 2 ? "scrollable" : ""
            }`}
          >
            <img
              src={manga.coverImage}
              alt={`Couverture de ${manga.title}`}
              className="mangaList_img"
            />
            <h4 className="mangaList_itemTitle">{manga.title}</h4>
            <p className="mangaList_author">
              <strong>Auteur: </strong>
              {manga.author}
            </p>
            <p className="mangaList_genre">
              <strong>Genre: </strong>
              {manga.genre.join(", ")}
            </p>
            <p className="mangaList_etat">
              <strong>État: </strong>
              {manga.status}
            </p>
            <button
              className="mangaList_btn"
              onClick={() => {
                handleDelete(manga._id);
              }}
            >
              Supprimer ce Manga
            </button>
            <div className="mangaList_chapters">
              <strong>Chapitres:</strong>
              <ul>
                {manga.chapters.map((chapter) => (
                  <li key={chapter._id}>
                    <p className="mangaList_titleChapter">{chapter.title}</p>
                    <button
                      className="mangaList_btn"
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
