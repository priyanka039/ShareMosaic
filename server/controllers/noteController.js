const Note = require('../models/note');

// Create a new note
exports.createNote = async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const note = new Note({ title, content, author });
    await note.save();
    res.status(201).json({ message: `Note created by ${author}`, note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get notes with pagination
exports.getNotes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  try {
    const total = await Note.countDocuments();
    const notes = await Note.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ notes, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get analytics
exports.getStats = async (req, res) => {
  try {
    const total = await Note.countDocuments();
    const avgLikesAgg = await Note.aggregate([
      { $group: { _id: null, avgLikes: { $avg: '$likes' } } }
    ]);
    const avgLikes = avgLikesAgg[0]?.avgLikes || 0;
    res.json({ totalNotes: total, averageLikes: avgLikes.toFixed(2) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Calculate reflection streak for an author
exports.getStreak = async (req, res) => {
  const { author } = req.query;
  if (!author) return res.status(400).json({ error: 'Author is required' });

  try {
    const notes = await Note.find({ author }).sort({ createdAt: -1 });
    const daysSet = new Set(notes.map(note => new Date(note.createdAt).toDateString()));

    let streak = 0;
    let today = new Date();
    for (;;) {
      if (daysSet.has(today.toDateString())) {
        streak++;
        today.setDate(today.getDate() - 1);
      } else break;
    }

    res.json({ author, streak });
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
