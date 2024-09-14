"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const noteSchema = new mongoose_1.default.Schema({
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
const Note = mongoose_1.default.model("note", noteSchema);
exports.default = Note;
