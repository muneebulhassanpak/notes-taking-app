"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
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
    members: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        default: "",
    },
    adminId: {
        type: String,
        required: true,
    },
});
const Note = mongoose.model("note", noteSchema);
exports.default = Note;
