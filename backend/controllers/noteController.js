const { getDb, saveDb } = require('../mockDb');

exports.getNotes = async (req, res) => {
  try {
    const db = getDb();
    const userNotes = db.notes.filter(n => n.userId === req.user._id);
    res.json(userNotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addNote = async (req, res) => {
  try {
    const { title, content, color = '#3B82F6' } = req.body;
    const db = getDb();

    const newNote = {
      _id: Date.now().toString(),
      userId: req.user._id,
      title,
      content,
      color,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    db.notes.push(newNote);
    saveDb(db);

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    const index = db.notes.findIndex(n => n._id === id && n.userId === req.user._id);
    if (index === -1) {
      return res.status(404).json({ message: 'Note not found' });
    }

    db.notes[index] = { ...db.notes[index], ...req.body, updatedAt: new Date() };
    saveDb(db);

    res.json(db.notes[index]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    const index = db.notes.findIndex(n => n._id === id && n.userId === req.user._id);
    if (index === -1) {
      return res.status(404).json({ message: 'Note not found' });
    }

    db.notes.splice(index, 1);
    saveDb(db);

    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
