import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

function Home() {
  const [mangas, setMangas] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/mangas")
      .then((response) => {
        setMangas(response.data.mangas);
      })
      .catch((error) => {
        console.error("Il y a eu une erreur !", error);
      });
  }, []);

  return (
    <>
      <h1>Liste des Mangas</h1>
      <ul>
        {mangas.map((manga) => (
          <li key={manga._id}>
            <h2>{manga.title}</h2>
            <p>{manga.description}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Home;
