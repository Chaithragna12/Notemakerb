import Note from "../models/note.js";


// ✅ Create Note
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
      userId: req.session.userId
    });

    res.status(201).json({
      message: "Note created",
      note
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get All Notes
export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.session.userId
    }).sort({ createdAt: -1 });

    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Update Note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Important security check
    if (note.userId.toString() !== req.session.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    note.title = req.body.title ?? note.title;
    note.content = req.body.content ?? note.content;

    await note.save();

    res.json({
      message: "Note updated",
      note
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Delete Note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== req.session.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await note.deleteOne();

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};