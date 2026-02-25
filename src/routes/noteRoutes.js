import express from "express";
import {
  createNote,
  getAllNotes,
  updateNote,
  deleteNote
} from "../controllers/noteControllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createNote);
router.get("/", protect, getAllNotes);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);

export default router;