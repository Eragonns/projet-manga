import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import {
  FaArrowCircleRight,
  FaArrowCircleLeft,
  FaArrowCircleUp
} from "react-icons/fa";
import { GoInfo } from "react-icons/go";

function ChapterPage() {
  const { mangaId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`/mangas/${mangaId}`)
      .then((response) => {
        setChapters(response.data.manga.chapters);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des chapitres :", error);
      });
  }, [mangaId]);

  useEffect(() => {
    axiosInstance
      .get(`/mangas/${mangaId}/chapters/${chapterId}`)
      .then((response) => {
        setChapter(response.data.chapter);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement du chapitre :", error);
      });
  }, [mangaId, chapterId]);

  if (!chapter || chapters.length === 0) return <div className="spinner"></div>;

  const currentIndex = chapters.findIndex((ch) => ch._id === chapterId);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  const handlePrevious = () => {
    if (prevChapter) {
      navigate(`/manga/${mangaId}/chapter/${prevChapter._id}`);
    }
  };

  const handleNext = () => {
    if (nextChapter) {
      navigate(`/manga/${mangaId}/chapter/${nextChapter._id}`);
    }
  };

  const handleGoToMangaPage = () => {
    navigate(`/manga/${mangaId}`);
  };

  const scrollToTop = () => {
    const scrollStep = -window.scrollY / (500 / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  };

  return (
    <div className="chapterPage_container">
      <h1 className="chapterPage_title">{chapter.title}</h1>
      <div className="chapterPage_btns">
        {prevChapter ? (
          <button onClick={handlePrevious} className="chapterPage_btn">
            Précédent <FaArrowCircleLeft className="chapterPage_reactIcon" />
          </button>
        ) : (
          <button onClick={handleGoToMangaPage} className="chapterPage_btn">
            Page de l&apos;œuvre <GoInfo className="chapterPage_reactIcon" />
          </button>
        )}
        {nextChapter ? (
          <button onClick={handleNext} className="chapterPage_btn">
            Suivant <FaArrowCircleRight className="chapterPage_reactIcon" />
          </button>
        ) : (
          <button onClick={handleGoToMangaPage} className="chapterPage_btn">
            Page de l&apos;œuvre <GoInfo className="chapterPage_reactIcon" />
          </button>
        )}
      </div>
      <div className="chapterPage_imagesContainer">
        {chapter.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Image ${index}`}
            className="chapterPage_image"
          />
        ))}
      </div>
      <div className="chapterPage_btns">
        {prevChapter ? (
          <button onClick={handlePrevious} className="chapterPage_btn">
            Précédent <FaArrowCircleLeft className="chapterPage_reactIcon" />
          </button>
        ) : (
          <button onClick={handleGoToMangaPage} className="chapterPage_btn">
            Page de l&apos;œuvre <GoInfo className="chapterPage_reactIcon" />
          </button>
        )}
        {nextChapter ? (
          <button onClick={handleNext} className="chapterPage_btn">
            Suivant <FaArrowCircleRight className="chapterPage_reactIcon" />
          </button>
        ) : (
          <button onClick={handleGoToMangaPage} className="chapterPage_btn">
            Page de l&apos;œuvre <GoInfo className="chapterPage_reactIcon" />
          </button>
        )}
      </div>
      <button onClick={scrollToTop} className="chapterPage_btnToTop">
        <FaArrowCircleUp className="chapterPage_reactIcon" />
      </button>
    </div>
  );
}

export default ChapterPage;
