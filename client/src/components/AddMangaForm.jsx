import { useRef, useState } from "react";
import { nanoid } from "nanoid";
import PropTypes from "prop-types";

// import axiosInstance from "../utils/axiosInstance.js";
import axiosRender from "../utils/axiosRender";

import Swal from "sweetalert2";
import { MANGA_GENRES } from "../../../serveur/src/utils/constants.util.js";

const AddMangaForm = ({ fetchMangas, token }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: [],
    description: "",
    status: "En Cours",
    coverImage: "",
    images: [],
    chapterTitle: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  const coverImageRef = useRef(null);
  const imagesRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      if (files && files.length > 0) {
        setFormData((prev) => ({ ...prev, images: files }));
      }
    } else if (name === "coverImage") {
      if (files && files.length > 0) {
        setFormData((prev) => ({ ...prev, coverImage: files[0] }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGenreChange = (genre) => {
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter((g) => g !== genre)
        : [...prev.genre, genre]
    }));
  };

  const handleAddManga = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    formData.genre.forEach((genre) => data.append("genre", genre));
    data.append("description", formData.description);
    data.append("status", formData.status);
    data.append("coverImage", formData.coverImage);
    for (let i = 0; i < formData.images.length; i++) {
      data.append("mangas", formData.images[i]);
    }
    data.append("chapterTitle", formData.chapterTitle);
    try {
      await axiosRender.post("/admin/mangas", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      await Swal.fire({
        icon: "success",
        title: "Manga ajouté avec succès !",
        confirmButtonText: "OK"
      });
      fetchMangas();
      setFormData({
        title: "",
        author: "",
        genre: [],
        description: "",
        status: "En Cours",
        coverImage: "",
        images: [],
        chapterTitle: ""
      });

      if (coverImageRef.current) coverImageRef.current.value = null;
      if (imagesRef.current) imagesRef.current.value = null;

      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Échec de l'ajout du manga.",
        text: "Une erreur s'est produite, veuillez réessayer.",
        confirmButtonText: "OK"
      });
      setFormData({
        title: "",
        author: "",
        genre: [],
        description: "",
        status: "En Cours",
        coverImage: "",
        images: [],
        chapterTitle: ""
      });
      if (coverImageRef.current) coverImageRef.current.value = null;
      if (imagesRef.current) imagesRef.current.value = null;
      setIsSubmitting(false);
    }
  };

  const isForm =
    !formData.title ||
    !formData.author ||
    formData.genre.length === 0 ||
    !formData.description;

  return (
    <form onSubmit={handleAddManga} className="addManga_formulaire">
      <div>
        <label className="addManga_label" htmlFor="title">
          Titre:
        </label>
        <input
          type="text"
          name="title"
          id="title"
          aria-label="titre"
          className="addManga_input"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="addManga_label" htmlFor="author">
          Auteur:
        </label>
        <input
          type="text"
          name="author"
          id="author"
          aria-label="auteur"
          className="addManga_input"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="addManga_label" htmlFor="dropdown">
          Genre:
        </label>
        <div className="addManga_dropdownContainer">
          <button
            type="button"
            className="addManga_dropdownBtn"
            aria-label="selectionner genre"
            id="dropdown"
            onClick={() => setShowGenreDropdown(!showGenreDropdown)}
          >
            Sélectionner des genres
          </button>
          {showGenreDropdown && (
            <div className="addManga_dropdownMenu">
              {MANGA_GENRES.map((genre) => (
                <label
                  key={nanoid()}
                  className="addManga_dropdownItem"
                  htmlFor="genre"
                >
                  <input
                    type="checkbox"
                    id="genre"
                    aria-label="genre"
                    checked={formData.genre.includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                  />
                  {genre}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="addManga_label" htmlFor="description">
          Synopsis:
        </label>
        <textarea
          name="description"
          id="description"
          aria-label="synopsis"
          className="addManga_textarea"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="addManga_label" htmlFor="status">
          Statut:
        </label>
        <select
          name="status"
          id="status"
          aria-label="statut"
          value={formData.status}
          onChange={handleChange}
          className="addManga_select"
        >
          <option value="En Cours">En Cours</option>
          <option value="Terminé">Terminé</option>
        </select>
      </div>
      <div>
        <label className="addManga_label" htmlFor="chapterTitle">
          Titre du Chapitre:
        </label>
        <input
          type="text"
          name="chapterTitle"
          id="chapterTitle"
          aria-label="titre du chapitre"
          className="addManga_input"
          value={formData.chapterTitle}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="addManga_label" htmlFor="coverImage">
          Image de couverture:
        </label>
        <input
          type="file"
          name="coverImage"
          id="coverImage"
          aria-label="image de couverture"
          className="addManga_input addManga_file"
          onChange={handleChange}
          accept="image/*"
          ref={coverImageRef}
        />
      </div>
      <div>
        <label className="addManga_label" htmlFor="images">
          Images:
        </label>
        <input
          type="file"
          name="images"
          id="images"
          aria-label="images"
          className="addManga_input addManga_file"
          multiple
          accept="image/*"
          onChange={handleChange}
          ref={imagesRef}
        />
      </div>
      <button
        type="submit"
        className="addManga_btn"
        aria-label="bouton d'envoie"
        disabled={isForm || isSubmitting}
      >
        {isSubmitting ? "Ajout en cours..." : "Ajouter Manga"}
      </button>
    </form>
  );
};

AddMangaForm.propTypes = {
  fetchMangas: PropTypes.func,
  token: PropTypes.string
};

export default AddMangaForm;
