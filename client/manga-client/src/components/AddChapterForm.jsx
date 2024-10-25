import { useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import Swal from "sweetalert2";

const AddChapterForm = ({ mangas, fetchMangas, token }) => {
  const [chapterData, setChapterData] = useState({
    mangaId: "",
    title: "",
    images: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const chapterImageRef = useRef(null);

  const handleChapterChange = (e) => {
    console.log("Évenement onChange déclenché");

    const { name, value, files } = e.target;

    if (name === "chapterImages") {
      if (files && files.length > 0) {
        console.log("fichiers selection", files);

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
    console.log("Titre du chapitre:", chapterData.title);
    console.log("Fichiers sélectionnés:", chapterData.images);
    for (let pair of data.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      console.log(chapterData.mangaId);

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

  return (
    <form onSubmit={handleAddChapter} className="addChapter_formulaire">
      <div>
        <label className="addChapter_label">Manga:</label>
        <select
          name="mangaId"
          value={chapterData.mangaId}
          onChange={handleChapterChange}
          className="addChapter_select"
          required
        >
          <option value="">Sélectionner un Manga</option>
          {mangas.map((manga) => (
            <option key={manga._id} value={manga._id}>
              {manga.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="addChapter_label">Titre du Chapitre:</label>
        <input
          type="text"
          name="title"
          value={chapterData.title}
          onChange={handleChapterChange}
          className="addChapter_input"
          required
        />
      </div>
      <div>
        <label className="addChapter_label">Images du Chapitre:</label>
        <input
          type="file"
          name="chapterImages"
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
        disabled={setChapterData.title || isSubmitting}
      >
        {isSubmitting ? "Ajout en cours..." : "Ajouter Chapitre"}
      </button>
    </form>
  );
};

export default AddChapterForm;
