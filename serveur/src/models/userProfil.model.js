import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const UserProfilSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true
    },
    pseudo: {
      type: String,
      required: [true, "Veuillez fournir un pseudo"]
    },
    name: {
      type: String,
      required: false
    },
    firstName: {
      type: String,
      required: false
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
    description: {
      type: String,
      required: false,
      trim: true
    },
    age: {
      type: Number,
      min: [0, "L'âge ne peut pas être négatif"],
      max: [120, "L'âge est irréaliste"],
      required: false
    },
    genre: {
      type: [String],
      required: false,
      maxlength: 20
    },
    // password: {
    //   type: String,
    //   required: [true, "Veuillez fournir un mot de passe"],
    //   minlength: 6
    // },
    profileImage: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

UserProfilSchema.index({ pseudo: 1 }, { unique: false });

UserProfilSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default model("UserProfil", UserProfilSchema);
