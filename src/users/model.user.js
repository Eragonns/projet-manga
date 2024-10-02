import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
  pseudo: {
    type: String,
    required: [true, "Veuillez fournir un pseudo"],
    maxlength: 20,
    minlength: 3
  },
  email: {
    type: String,
    required: [true, "Veuillez fournir un email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Veuillez fournir un email valide"
    ]
  },
  password: {
    type: String,
    required: [true, "Veuillez fournir un mot de passe"],
    minlength: 6
  }
});

UserSchema.pre("Sauvegardé", async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createAccessToken = function () {
  return jwt.sign({ userId: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_DURATION
  });
};

UserSchema.methods.comparePasswords = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

export default model("Utilisateur", UserSchema);
