import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

function MangaPage() {
  const { mangaId } = useParams();
  const [manga, setManga] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionLimit = 200;

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

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };
  console.log("eee", manga);

  const truncatedDescription =
    manga.description.length > descriptionLimit && !isExpanded
      ? `${manga.description.slice(0, descriptionLimit)}...`
      : manga.description;

  return (
    <div className="mangaPage_container">
      <img src={manga.coverImage} alt={`Couverture de ${manga.title}`} />
      <div className="mangaPage_bloc">
        <h1 className="mangaPage_title">{manga.title}</h1>
        <h2 className="mangaPage_status">{manga.status}</h2>
        <div className="mangaPage_genres">
          {manga.genre.map((genre, index) => (
            <span key={index} className="mangaPage_genreItem">
              {genre}
            </span>
          ))}
        </div>
        <p className="mangaPage_text">{truncatedDescription}</p>
        {manga.description.length > descriptionLimit && (
          <button onClick={toggleDescription} className="mangaPage_toggleBtn">
            {isExpanded ? "Voir moins" : "Voir plus"}
          </button>
        )}

        <h2>Chapitres:</h2>
        <ul>
          {manga.chapters.map((chapter) => (
            <li key={chapter._id} className="mangaPage_liens">
              <Link
                to={`/manga/${mangaId}/chapter/${chapter._id}`}
                className="mangaPage_lien"
              >
                {chapter.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MangaPage;
