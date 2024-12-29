import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";
import axiosRender from "../utils/axiosRender";

function MangaPage() {
  const { mangaId } = useParams();
  const [manga, setManga] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionLimit = 200;

  useEffect(() => {
    axiosRender
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

  const truncatedDescription =
    manga.description.length > descriptionLimit && !isExpanded
      ? `${manga.description.slice(0, descriptionLimit)}...`
      : manga.description;

  return (
    <div className="mangaPage_container">
      <img
        src={manga.coverImage}
        alt={`Couverture de ${manga.title}`}
        className="mangaPage_img"
      />
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
        <div className="mangaPage_chapters">
          <h2 className="mangaPage_titleChapters">Chapitres:</h2>
          <ul>
            {manga.chapters.map((chapter) => (
              <Link
                key={chapter._id}
                to={`/manga/${mangaId}/chapter/${chapter._id}`}
                className="mangaPage_lien"
              >
                <li key={chapter._id} className="mangaPage_liens">
                  {chapter.title}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MangaPage;
