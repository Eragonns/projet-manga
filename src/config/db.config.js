import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

const dbConnection = mongoose.connection;

dbConnection.once("open", () => console.log("Base de données connectée"));

dbConnection.on("error", (err) => console.log(`Erreur de connexion: ${err}`));

export default connectDB;
