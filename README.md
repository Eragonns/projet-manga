# ScanMangaVerse

**ScanMangaVerse** est une application web permettant aux utilisateurs de lire des scans de manga. Le projet est divisé en deux parties principales : un front-end (React) et un back-end (Node.js).

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) (version 14 ou supérieure)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) pour la base de données
- Un compte [Cloudinary](https://cloudinary.com/) pour la gestion des images

---

## Installation

1.  **Clonez le dépôt :**

    ```bash
    git clone https://github.com/Eragonns/projet-manga
    cd projet-manga

    ```

2.  **Installer les dépendances :**

    - pour le front-end :
      cd client
      npm install

    - pour le back-end :
      cd serveur
      npm install

3.  **Configuration des variables d'environnement :**

    - un fichier .env.sample est fourni comme modèle.
      il contient :
      MONGO_URI=Votre_URL_MongoDB
      JWT_SECRET=Votre_Secret_JWT
      JWT_DURATION=Durée_du_Token (ex: 30d)

          CLOUD_NAME=Votre_Nom_Cloudinary
          CLOUD_API_KEY=Votre_Clé_API_Cloudinary
          CLOUD_API_SECRET=Votre_Secret_API_Cloudinary

    - Renommez ce fichier en .env dans le dossier serveur, puis remplissez les valeurs nécessaires.
      mv .env.sample .env

---

## Lancer l'application

1. **lancer le back-end :**

   - depuis le dossier serveur :
     npm run dev

2. **lancer le front-end :**

   - depuis le dossier client :
     npm run dev

3. **accéder à l'application**
   - une fois les deux parties en cours d'execution, ouvrez votre navigateur et accéder à http://localhost:5000

---

## Fonctionnalités

1. **Connexion obligatoire :**
   L'accès au site nécessite une authentification. Créez un compte ou connectez-vous avec vos identifiants pour explorer les scans de manga.

2. **Lecture de manga :**
   Parcourez et lisez des mangas directement depuis votre navigateur.

3. **Recherche**
   Recherchez des mangas par titre.

---

## Contribution

    -- Les contributions sont les bienvenues ! Suivez ces étapes pour contribuer :

1. **Forkez le projet**

2. **Créez une branche pour votre fonctionnalité :**
   git checkout -b feature/nouvelle-fonctionnalite

3. **Commitez vos modifications :**
   git commit -m "Ajout d'une nouvelle fonctionnalité"

4. **Poussez vos modifications :**
   git push origin feature/nouvelle-fonctionnalite

5. **Créez une Pull Request .**
