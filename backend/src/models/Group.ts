import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  members: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    default: "active",
  },
  adminId: {
    type: String,
    required: true,
  },
});

const Note = mongoose.model("note", noteSchema);

export default Note;
