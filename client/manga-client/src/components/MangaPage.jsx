import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

function MangaPage() {
  const { mangaId } = useParams();
  const [manga, setManga] = useState(null);
  console.log(mangaId);

  useEffect(() => {
    axiosInstance
      .get(`/mangas/${mangaId}`)
      .then((response) => {
        setManga(response.data.manga);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement du manga :", error);
      });
  }, [mangaId]);

  if (!manga) return <div className="spinner"></div>;

  return (
    <div>
      <img src={manga.coverImage} alt={`Couverture de ${manga.title}`} />
      <h1>{manga.title}</h1>
      <p>{manga.description}</p>

      <h2>Chapitres</h2>
      <ul>
        {manga.chapters.map((chapter) => (
          <li key={chapter._id}>
            <a href={`/manga/${mangaId}/chapter/${chapter._id}`}>
              {chapter.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MangaPage;
