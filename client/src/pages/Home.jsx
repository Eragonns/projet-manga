import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [latestMangas, setLatestMangas] = useState([]);
  const [popularMangas, setPopularMangas] = useState([]);
  const [allMangas, setAllMangas] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
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

    axiosInstance
      .get("/manga/popular")
      .then((response) => {
        console.log("mangas populaire", response.data.mangas);

        setPopularMangas(response.data.mangas.slice(0, 10));
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

  const incrementReads = async (mangaId) => {
    try {
      const response = await axiosInstance.post(
        `/manga/${mangaId}/increment-reads`
      );
      console.log("read increment: ", response.data);
    } catch (error) {
      console.error("Erreur lors de l'incrémentation des lectures:", error);
    }
  };

  const handleMangaClick = async (mangaId) => {
    await incrementReads(mangaId);
    navigate(`manga/${mangaId}`);
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
        <Carousel
          showThumbs={false}
          showIndicators={false}
          showStatus={false}
          infiniteLoop
          autoPlay
          interval={3000}
          transitionTime={600}
          stopOnHover
          className="home_carousel"
        >
          {latestMangas.map((manga) => (
            <div key={manga._id}>
              <img
                className="home_carousel_img"
                src={manga.coverImage}
                alt={`Couverture de ${manga.title}`}
                onClick={() => handleMangaClick(manga._id)}
              />
              <h2 className="home_carouselTitle">{manga.title}</h2>
            </div>
          ))}
        </Carousel>
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
      {isDataLoaded && popularMangas.length > 0 && (
        <Carousel
          showThumbs={false}
          showIndicators={false}
          showStatus={false}
          infiniteLoop
          autoPlay
          interval={3000}
          transitionTime={600}
          stopOnHover
          className="home_carousel"
        >
          {popularMangas.map((manga) => (
            <div key={manga._id}>
              <img
                src={manga.coverImage}
                alt={`Image mangas populaires ${manga.title}`}
                onClick={() => handleMangaClick(manga._id)}
              />
              <h2 className="home_carouselTitle">{manga.title}</h2>
            </div>
          ))}
        </Carousel>
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
