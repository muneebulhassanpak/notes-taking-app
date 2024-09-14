import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationHash: {
    type: String,
    default: "",
    required: true,
  },
  token: {
    type: String,
    default: "",
  },
  groups: {
    type: [],
    default: [],
  },
});

const User = mongoose.model("user", userSchema);

export default User;
