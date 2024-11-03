import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useNavigate } from "react-router-dom";

function Home() {
  const [latestMangas, setLatestMangas] = useState([]);
  const [popularGenres, setPopularGenres] = useState([]);
  const [allMangas, setAllMangas] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/mangas")
      .then((response) => {
        const sortedMangas = response.data.mangas.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        setLatestMangas(sortedMangas.slice(0, 10));
        setAllMangas(sortedMangas);
        setIsDataLoaded(true);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des mangas:", error);
      });

    axiosInstance
      .get("/genres/popular")
      .then((response) => {
        setPopularGenres(response.data.genres.slice(0, 4));
      })
      .catch((error) => {
        console.error(
          "Erreur lors du chargement des genres populaires:",
          error
        );
      });
  }, []);

  const loadMoreMangas = () => {
    setPageIndex((prevIndex) => prevIndex + 1);
  };

  const handleMangaClick = (mangaId) => {
    navigate(`manga/${mangaId}`);
  };

  const handleChapterClick = (mangaId, chapterId) => {
    navigate(`/manga/${mangaId}/chapter/${chapterId}}`);
  };

  return (
    <>
      {isDataLoaded && (
        <Carousel
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={3000}
          transitionTime={600}
          stopOnHover
          className="home_latestMangas_carousel"
        >
          {latestMangas.map((manga) => (
            <div key={manga._id}>
              <img
                src={manga.coverImage}
                alt={`Couverture de ${manga.title}`}
              />
              <h2>{manga.title}</h2>
            </div>
          ))}
        </Carousel>
      )}

      <h2>Genres Populaires</h2>
      <Carousel
        showThumbs={false}
        showArrows
        className="home_popularGenres_carousel"
      >
        {popularGenres.map((genre) => (
          <div key={genre.id}>
            <img
              src={genre.imageUrl}
              alt={`Image pour le genre ${genre.name}`}
            />
            <h3>{genre.name}</h3>
          </div>
        ))}
      </Carousel>

      <h2>Derniers Mangas Sortis</h2>
      <ul className="home_mangaList">
        {allMangas.slice(0, pageIndex * 24).map((manga) => (
          <li key={manga._id}>
            <img
              src={manga.coverImage}
              alt={`Couverture de ${manga.title}`}
              onClick={() => handleMangaClick(manga._id)}
            />
            <div>
              <h3>{manga.title}</h3>
              <div>
                {manga.chapters.slice(-2).map((chapter) => (
                  <button
                    key={chapter._id}
                    onClick={() => handleChapterClick(manga._id, chapter._id)}
                  >
                    {chapter.title}
                  </button>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={loadMoreMangas}>Voir plus</button>
    </>
  );
}

export default Home;
