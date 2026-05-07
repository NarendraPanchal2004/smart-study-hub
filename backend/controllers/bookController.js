const { getDb, saveDb } = require('../mockDb');

exports.getBooks = async (req, res) => {
  try {
    const db = getDb();
    res.json(db.books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addBook = async (req, res) => {
  try {
    const { title, category, class: bookClass, subject, board, pdfUrl } = req.body;
    const db = getDb();

    const newBook = {
      _id: Date.now().toString(),
      title,
      category,
      class: bookClass,
      subject,
      board,
      pdfUrl,
      addedBy: req.user._id,
      createdAt: new Date()
    };

    db.books.push(newBook);
    saveDb(db);

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
