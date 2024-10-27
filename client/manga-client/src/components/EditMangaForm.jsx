import { useState } from "react";

const EditMangaForm = ({ handleUpdateManga, setEditManga, mangas }) => {
  const [selectedManga, setSelectedManga] = useState(null);

  const handleSelectManga = (manga) => {
    setSelectedManga(manga);
    setEditManga(manga);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedManga) {
      alert("Veuillez sélectionner un manga à modifier .");
      return;
    }

    const updateManga = {
      _id: selectedManga._id,
      title: e.target.title.value,
      author: e.target.author.value,
      genre: e.target.genre.value.split(","),
      status: e.target.status.value,
      description: e.target.description.value
    };
    handleUpdateManga(updateManga);
  };

  return (
    <div>
      <p>Sélectionnez un manga à modifier :</p>
      <ul>
        {mangas.map((manga) => (
          <li key={manga._id}>
            <button onClick={() => handleSelectManga(manga)}>
              {manga.title}
            </button>
          </li>
        ))}
      </ul>

      {selectedManga && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            defaultValue={selectedManga.title}
            required
          />
          <input
            type="text"
            name="author"
            defaultValue={selectedManga.author}
            required
          />
          <input
            type="text"
            name="genre"
            defaultValue={selectedManga.genre.join(",")}
            required
          />
          <input
            type="text"
            name="status"
            defaultValue={selectedManga.status}
            required
          />
          <textarea
            name="description"
            defaultValue={selectedManga.description}
          ></textarea>
          <button type="submit">Mettre à jour</button>
          <button type="button" onClick={() => setEditManga(null)}>
            Annuler
          </button>
        </form>
      )}
    </div>
  );
};

export default EditMangaForm;
