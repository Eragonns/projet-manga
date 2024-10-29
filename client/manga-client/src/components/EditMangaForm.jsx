import { useState } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const EditMangaForm = ({ handleUpdateManga, setEditManga, mangas }) => {
  const [selectedManga, setSelectedManga] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectManga = (e) => {
    const manga = mangas.find((m) => m._id === e.target.value);
    setSelectedManga(manga);
    setEditManga(manga);
  };

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!selectedManga) {
      alert("Veuillez sélectionner un manga à modifier .");
      return;
    }
    const data = new FormData();
    data.append("_id", selectedManga._id);
    data.append("title", e.target.title.value);
    data.append("author", e.target.author.value);
    data.append("genre", e.target.genre.value);
    data.append("status", e.target.status.value);
    data.append("description", e.target.description.value);

    if (coverImage) data.append("coverImage", coverImage);

    handleUpdateManga(data);
    Swal.fire({
      icon: "success",
      title: "Manga modifié avec succès !",
      confirmButtonText: "OK"
    });
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setSelectedManga(null);
    setEditManga(null);
    setCoverImage(null);
  };
  const sortedMangas = mangas
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));
  return (
    <div>
      <label htmlFor="select" className="sr-only"></label>
      <select
        onChange={handleSelectManga}
        value={selectedManga ? selectedManga._id : ""}
        id="select"
        className="editManga_select"
        aria-label="selectionner-un-manga"
      >
        <option value="" disabled className="editManga_option">
          Choisir un manga
        </option>
        {sortedMangas.map((manga) => (
          <option
            key={manga._id}
            value={manga._id}
            className="editManga_option"
          >
            {manga.title}
          </option>
        ))}
      </select>

      {selectedManga && (
        <form
          key={selectedManga ? selectedManga._id : "empty"}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="editManga_form"
        >
          <label htmlFor="title" className="sr-only"></label>
          <input
            type="text"
            name="title"
            id="title"
            className="editManga_input"
            aria-label="titre"
            defaultValue={selectedManga.title}
            required
          />
          <label htmlFor="author" className="sr-only"></label>
          <input
            type="text"
            name="author"
            id="author"
            className="editManga_input"
            aria-label="autheur"
            defaultValue={selectedManga.author}
            required
          />
          <label htmlFor="genre" className="sr-only"></label>
          <input
            type="text"
            name="genre"
            id="genre"
            className="editManga_input"
            aria-label="genre"
            defaultValue={selectedManga.genre.join(",")}
            required
          />
          <label htmlFor="status" className="sr-only"></label>
          <input
            type="text"
            name="status"
            id="status"
            className="editManga_input"
            aria-label="status"
            defaultValue={selectedManga.status}
            required
          />
          <label htmlFor="description" className="sr-only"></label>
          <textarea
            name="description"
            className="editManga_textarea"
            id="description"
            aria-label="description"
            defaultValue={selectedManga.description}
          ></textarea>
          <label className="editManga_label" htmlFor="coverImage">
            {" "}
            Nouvelle image de couverture:
          </label>
          <input
            type="file"
            name="coverImage"
            id="coverImage"
            accept="image/*"
            aria-label="nouvelle image de couverture"
            className="editManga_input editManga_inputFile"
            onChange={handleCoverImageChange}
          />

          <button
            type="submit"
            className="editManga_btnSubmit"
            aria-label="boutton d'envoie modification manga"
          >
            {isSubmitting ? "Édition en cours..." : "Modifier manga"}
          </button>
          <button
            type="button"
            aria-label="boutton d'annulation"
            className="editManga_btnButton"
            onClick={handleCancel}
          >
            Annuler
          </button>
        </form>
      )}
    </div>
  );
};

EditMangaForm.propTypes = {
  handleUpdateManga: PropTypes.func,
  setEditManga: PropTypes.func,
  mangas: PropTypes.array
};

export default EditMangaForm;
