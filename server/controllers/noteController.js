const Note = require('../models/note');

// Create a new note
exports.createNote = async (req, res) => {
  const { content, author } = req.body;
  try {
    const note = new Note({ content, author });
    await note.save();
    res.status(201).json({ message: `Note created by ${author}`, note });
  } catch (error) {
    res.status(500).json({ error: `Failed to create note: ${error.message}` });
  }
};

// Get all notes
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like a note
exports.likeNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    note.likes = (note.likes ?? 0) + 1;
    await note.save();
    res.json({ message: 'Liked note', note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Unlike a note
exports.unlikeNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    note.likes = Math.max((note.likes ?? 0) - 1, 0);
    await note.save();
    res.json({ message: 'Unliked note', note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Note.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted', deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
