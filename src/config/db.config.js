import mongoose from "mongoose";

const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

const dbConnection = mongoose.connection;

dbConnection.once("Ouvert", () => console.log("Base de données connectée"));

dbConnection.on("Erreur", (err) => console.log(`Erreur de connexion: ${err}`));

export default connectDB;
