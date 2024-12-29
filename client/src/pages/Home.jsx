import { useEffect, useState, useRef } from "react";
import axiosRender from "../utils/axiosRender";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [latestMangas, setLatestMangas] = useState([]);
  const [popularMangas, setPopularMangas] = useState([]);
  const [allMangas, setAllMangas] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const latestCarouselRef = useRef(null);
  const popularCarouselRef = useRef(null);
  const latestIntervalRef = useRef(null);
  const popularIntervalRef = useRef(null);
  const [latestCurrentIndex, setLatestCurrentIndex] = useState(0);
  const [popularCurrentIndex, setPopularCurrentIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    axiosRender
      .get("/mangas")
      .then((response) => {
        const sortedMangas = response.data.mangas.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLatestMangas(sortedMangas.slice(0, 10));
        setAllMangas(sortedMangas);
        setIsDataLoaded(true);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des mangas:", error);
      });

    axiosRender
      .get("/manga/popular")
      .then((response) => {
        setPopularMangas(response.data.mangas.slice(0, 10));
      })
      .catch((error) => {
        console.error(
          "Erreur lors du chargement des genres populaires:",
          error
        );
      });

    latestIntervalRef.current = setInterval(() => {
      setLatestCurrentIndex(
        (prevIndex) => (prevIndex + 1) % latestMangas.length
      );
    }, 3000);

    popularIntervalRef.current = setInterval(() => {
      setPopularCurrentIndex(
        (prevIndex) => (prevIndex + 1) % popularMangas.length
      );
    }, 3000);

    return () => {
      clearInterval(latestIntervalRef.current);
      clearInterval(popularIntervalRef.current);
    };
  }, [latestMangas.length, popularMangas.length]);

  useEffect(() => {
    if (latestCarouselRef.current) {
      const totalItems = latestMangas.length + 4;
      const transitionDuration = "1s";

      if (latestCurrentIndex === totalItems - 4) {
        // Transition à la première image
        setTimeout(() => {
          latestCarouselRef.current.style.transition = "none";
          latestCarouselRef.current.style.transform = `translateX(0%)`;
          setLatestCurrentIndex(0);
        }, 500); // Correspond au temps de la transition CSS
      } else {
        latestCarouselRef.current.style.transition = `transform ${transitionDuration} ease-in-out`;
        latestCarouselRef.current.style.transform = `translateX(-${
          latestCurrentIndex * 100
        }%)`;
      }
    }
  }, [latestCurrentIndex, latestMangas.length]);

  useEffect(() => {
    if (popularCarouselRef.current) {
      const totalItems = popularMangas.length + 4;
      const transitionDuration = "2s";

      if (popularCurrentIndex === totalItems - 4) {
        // Transition à la première image
        setTimeout(() => {
          popularCarouselRef.current.style.transition = "none";
          popularCarouselRef.current.style.transform = `translateX(0%)`;
          setPopularCurrentIndex(0);
        }, 500); // Correspond au temps de la transition CSS
      } else {
        popularCarouselRef.current.style.transition = `transform ${transitionDuration} ease-in-out`;
        popularCarouselRef.current.style.transform = `translateX(-${
          popularCurrentIndex * 100
        }%)`;
      }
    }
  }, [popularCurrentIndex, popularMangas.length]);

  const loadMoreMangas = () => {
    setPageIndex((prevIndex) => prevIndex + 1);
  };

  const incrementReads = async (mangaId) => {
    try {
      await axiosRender.post(`/manga/${mangaId}/increment-reads`);
    } catch (error) {
      console.error("Erreur lors de l'incrémentation des lectures:", error);
    }
  };

  const handleMangaClick = async (mangaId) => {
    await incrementReads(mangaId);
    navigate(`/manga/${mangaId}`);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === "") {
      setSearchResults([]);
      return;
    }
    const filteredMangas = allMangas.filter((manga) =>
      manga.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchResults(filteredMangas);
  };

  return (
    <>
      {isDataLoaded && (
        <div className="home_carousel_container">
          <div className="home_carousel" ref={latestCarouselRef}>
            {/* Clone du dernier élément */}
            {latestMangas.map((manga, index) => (
              <div key={`${manga._id}-${index}`} className="home_carousel_item">
                <img
                  className="home_carousel_img"
                  src={manga.coverImage}
                  alt={`Couverture de ${manga.title}`}
                  onClick={() => handleMangaClick(manga._id)}
                />
                <h2 className="home_carouselTitle">{manga.title}</h2>
              </div>
            ))}

            {/* Tous les éléments */}
            {latestMangas.slice(0, 4).map((manga, index) => (
              <div key={`clone-${index}`} className="home_carousel_item">
                <img
                  className="home_carousel_img"
                  src={manga.coverImage}
                  alt={`Couverture de ${manga.title}`}
                  onClick={() => handleMangaClick(manga._id)}
                />
                <h2 className="home_carouselTitle">{manga.title}</h2>
              </div>
            ))}
            {/* Clone du premier élément */}
            {latestMangas.length > 0 && (
              <div className="home_carousel_item">
                <img
                  className="home_carousel_img"
                  src={latestMangas[0].coverImage}
                  alt={`Couverture de ${latestMangas[0].title}`}
                  onClick={() => handleMangaClick(latestMangas[0]._id)}
                />
                <h2 className="home_carouselTitle">{latestMangas[0].title}</h2>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="home_searchContainer">
        <input
          type="text"
          placeholder="Rechercher un manga..."
          value={searchQuery}
          onChange={handleSearch}
          className="home_searchInput"
        />
      </div>
      {searchResults.length > 0 && (
        <ul className="home_searchResults">
          {searchResults.map((manga) => (
            <li
              key={manga._id}
              onClick={() => handleMangaClick(manga._id)}
              className="home_searchResultItem"
            >
              {manga.title}
            </li>
          ))}
        </ul>
      )}
      <h1 className="home_title">Mangas Populaires</h1>
      {isDataLoaded && (
        <div className="home_carousel_container">
          <div className="home_carousel" ref={popularCarouselRef}>
            {popularMangas.map((manga) => (
              <div key={manga._id} className="home_carousel_item">
                <img
                  src={manga.coverImage}
                  alt={`Image mangas populaires ${manga.title}`}
                  onClick={() => handleMangaClick(manga._id)}
                />
                <h2 className="home_carouselTitle">{manga.title}</h2>
              </div>
            ))}
            {popularMangas.slice(0, 4).map((manga, index) => (
              <div key={`clone-${index}`} className="home_carousel_item">
                <img
                  src={manga.coverImage}
                  alt={`Image mangas populaires ${manga.title}`}
                  onClick={() => handleMangaClick(manga._id)}
                />
                <h2 className="home_carouselTitle">{manga.title}</h2>
              </div>
            ))}
          </div>
        </div>
      )}
      <h1 className="home_title">Derniers Mangas Sortis</h1>
      <ul className="home_mangaList">
        {allMangas.slice(0, pageIndex * 24).map((manga) => (
          <article key={manga._id} className="home_mangaList_article">
            <li>
              <img
                src={manga.coverImage}
                alt={`Couverture de ${manga.title}`}
                onClick={() => handleMangaClick(manga._id)}
                className="home_mangaList_img"
              />
              <div>
                <h2 className="home_mangaList_title">{manga.title}</h2>
                <div className="home_mangaList_chapters">
                  {manga.chapters.slice(-2).map((chapter) => (
                    <Link
                      key={chapter._id}
                      to={`/manga/${manga._id}/chapter/${chapter._id}`}
                      className="home_chapterLink"
                    >
                      {chapter.title.split(":")[0] + ":"}
                      <span className="home_chapterLink_span">New</span>
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          </article>
        ))}
      </ul>
      {pageIndex * 24 < allMangas.length && (
        <button onClick={loadMoreMangas} className="home_mangaList_btn">
          Voir plus
        </button>
      )}
    </>
  );
}

export default Home;
