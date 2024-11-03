import { useEffect, useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { MANGA_GENRES } from "../../../../src/utils/constants.util.js";
import { nanoid } from "nanoid";
import { AuthContext } from "../contexts/AuthContext.jsx";
import Swal from "sweetalert2";
import { dialogBox2 } from "../utils/dialogBox.js";

const UserProfile = () => {
  const { setUser } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    pseudo: "",
    name: "",
    firstName: "",
    email: "",
    description: "",
    profileImage: "",
    age: "",
    genre: []
  });

  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        const profileData = response.data.user;
        setFormData({
          pseudo: profileData.pseudo,
          name: profileData.name,
          firstName: profileData.firstName,
          email: profileData.email,
          description: profileData.description,
          profileImage: profileData.profileImage,
          age: profileData.age,
          genre: profileData.genre || []
        });
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreChange = (genre) => {
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter((g) => g !== genre)
        : [...prev.genre, genre]
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    const previewUrl = URL.createObjectURL(e.target.files[0]);
    setFormData((prev) => ({ ...prev, profileImage: previewUrl }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const confirmed = await dialogBox2(
      "Confirmation de modification",
      "Voulez-vous vraiment modifier votre profil"
    );
    if (confirmed) {
      setIsSubmitting(true);
      const data = new FormData();
      if (image) data.append("profileImage", image);
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => data.append(key, item));
        } else {
          data.append(key, value);
        }
      });
      try {
        const response = await axiosInstance.put(
          "/users/profile/update",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
        await Swal.fire("Modifié", "Profil mis à jour avec succès", "success");
        setUser(response.data.user);
        console.log("Profil mis à jour avec succès:", response.data);
        setIsSubmitting(false);
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        await Swal.fire("Annulé", "Modification annulée", "info");
        setIsSubmitting(false);
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const confirmed = await dialogBox2(
      "Confirmation de modification",
      "Voulez-vous vraiment changer votre mot de passe"
    );
    if (confirmed) {
      setIsSubmit(true);
      try {
        await axiosInstance.put("/users/profile/change-password", {
          oldPassword,
          newPassword
        });
        await Swal.fire(
          "Modifié",
          "Mot de Passe mis à jour avec succès",
          "success"
        );
        setNewPassword("");
        setOldPassword("");
        setIsSubmit(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          await Swal.fire(
            "Annulé",
            "L'ancien mot de passe est incorrect",
            "info"
          );
        } else {
          await Swal.fire(
            "Annulé",
            "Erreur lors du changement de mot de passe",
            "info"
          );
        }
        console.error("Erreur lors du changement de mot de passe:", error);
        setIsSubmit(false);
      }
    }
  };

  return (
    <div>
      <h1>Bienvenue, sur votre profil {formData.pseudo}</h1>

      <form onSubmit={handleUpdateProfile}>
        <div>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            aria-label="image"
            onChange={handleImageChange}
          />
          {formData.profileImage && (
            <img src={formData.profileImage} alt="Image de profil actuelle" />
          )}
        </div>
        <div>
          <label htmlFor="pseudo">Pseudo:</label>
          <input
            type="text"
            name="pseudo"
            id="pseudo"
            aria-label="pseudo"
            value={formData.pseudo}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="name">Nom:</label>
          <input
            type="text"
            name="name"
            id="name"
            aria-label="nom"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="firstName">Prénom:</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            aria-label="prenom"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            aria-label="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            id="description"
            aria-label="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="age">Âge:</label>
          <input
            type="number"
            name="age"
            id="age"
            aria-label="age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="dropdown">Genre Favoris:</label>
          <div>
            <button
              type="button"
              id="dropdown"
              aria-label="selectionner des genres"
              onClick={() => setShowGenreDropdown(!showGenreDropdown)}
            >
              Sélectionner des genres
            </button>
            {showGenreDropdown && (
              <div className="addManga_dropdownMenu">
                {MANGA_GENRES.map((genre) => (
                  <label
                    key={nanoid()}
                    htmlFor="genre"
                    className="addManga_dropdownItem"
                  >
                    <input
                      type="checkbox"
                      id="genre"
                      aria-label="genre"
                      checked={formData.genre.includes(genre)}
                      onChange={() => handleGenreChange(genre)}
                    />
                    {genre}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <button type="submit" aria-label="bouton mise a jour profil">
          {isSubmitting ? "Mise a jour en cours..." : "Mettre à jour le profil"}
        </button>
      </form>

      <form onSubmit={handleChangePassword}>
        <h2>Changer le Mot de Passe</h2>
        <div>
          <label htmlFor="oldPassword">Ancien Mot de Passe:</label>
          <input
            type="password"
            id="oldPassword"
            aria-label="ancien mot de passe"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="newPassword">Nouveau Mot de Passe:</label>
          <input
            type="password"
            id="newPassword"
            aria-label="nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button type="submit" aria-label="boutton changement de mot de passe">
          {isSubmit
            ? "Changement du mot de passe..."
            : "Changer le Mot de Passe"}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
