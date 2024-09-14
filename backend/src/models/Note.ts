import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    unique: true,
  },
  assignedTo: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "",
  },
  dueDate: {
    type: Date,
    required: true,
  },
  projectId: {
    type: String,
    default: "",
    required: true,
  },
});

const Note = mongoose.model("note", noteSchema);

export default Note;
