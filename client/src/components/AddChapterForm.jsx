import { useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const AddChapterForm = ({ mangas, fetchMangas, token }) => {
  const [chapterData, setChapterData] = useState({
    mangaId: "",
    title: "",
    images: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const chapterImageRef = useRef(null);

  const handleChapterChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "chapterImages") {
      if (files && files.length > 0) {
        setChapterData((prev) => ({ ...prev, images: Array.from(files) }));
      }
    } else {
      setChapterData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();

    data.append("title", chapterData.title);
    data.append("mangaId", chapterData.mangaId);
    for (let i = 0; i < chapterData.images.length; i++) {
      data.append("chapterImages", chapterData.images[i]);
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

      await Swal.fire({
        icon: "success",
        title: "Chapitre ajouté avec succès !",
        confirmButtonText: "OK"
      });
      fetchMangas();
      setChapterData({
        mangaId: "",
        title: "",
        images: []
      });

      if (chapterImageRef.current) chapterImageRef.current.value = null;

      setIsSubmitting(false);
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout du chapitre:",
        error.response || error
      );
      await Swal.fire({
        icon: "error",
        title: "Échec de l'ajout du chapitre.",
        text: "Une erreur s'est produite, veuillez réessayer.",
        confirmButtonText: "OK"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const sortedMangas = mangas
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));
  return (
    <form onSubmit={handleAddChapter} className="addChapter_formulaire">
      <div>
        <label className="addChapter_label" htmlFor="mangaId">
          Manga:
        </label>
        <select
          name="mangaId"
          id="mangaId"
          aria-label="liste des manga"
          value={chapterData.mangaId}
          onChange={handleChapterChange}
          className="addChapter_select"
          required
        >
          <option value="">Sélectionner un Manga</option>
          {sortedMangas.map((manga) => (
            <option key={manga._id} value={manga._id}>
              {manga.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="addChapter_label" htmlFor="title">
          Titre du Chapitre:
        </label>
        <input
          type="text"
          name="title"
          id="title"
          aria-label="titre du chapitre"
          value={chapterData.title}
          onChange={handleChapterChange}
          className="addChapter_input"
        />
      </div>
      <div>
        <label className="addChapter_label" htmlFor="chapterImages">
          Images du Chapitre:
        </label>
        <input
          type="file"
          name="chapterImages"
          id="chapterImages"
          aria-label="images du chapitre"
          multiple
          accept="image/*"
          onChange={handleChapterChange}
          className="addChapter_file addChapter_input"
          ref={chapterImageRef}
        />
      </div>
      <button
        type="submit"
        className="addChapter_btn"
        aria-label="boutton d'ajout du chapitre"
        disabled={!chapterData.mangaId || isSubmitting}
      >
        {isSubmitting ? "Ajout en cours..." : "Ajouter Chapitre"}
      </button>
    </form>
  );
};

AddChapterForm.propTypes = {
  mangas: PropTypes.array,
  fetchMangas: PropTypes.func,
  token: PropTypes.string
};
export default AddChapterForm;
