const Book = require('../models/Book');

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addBook = async (req, res) => {
  try {
    const { title, category, class: bookClass, subject, board, pdfUrl } = req.body;

    const newBook = await Book.create({
      title,
      category,
      class: bookClass,
      subject,
      board,
      pdfUrl,
      addedBy: req.user._id
    });

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
