import React, { useState, useEffect } from 'react';
import { Book, Download, Search, ChevronRight, Library as LibraryIcon, Plus, X } from 'lucide-react';
import { getBooks, addBook, uploadLibraryFile } from '../services/libraryService';
import { useAuth } from '../context/AuthContext';
import styles from './Library.module.css';

const Library = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState(10);
  const [category, setCategory] = useState('school');
  const [allBooks, setAllBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    category: 'school',
    class: 10,
    subject: '',
    board: 'Maharashtra State Board',
    pdfUrl: '#'
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setAllBooks(data);
    } catch (err) {
      console.error('Error fetching books', err);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (isUploading) return;
    try {
      await addBook(newBook);
      fetchBooks();
      setIsModalOpen(false);
      setNewBook({ ...newBook, title: '', subject: '', pdfUrl: '#' });
    } catch (err) {
      console.error('Failed to add book', err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const { url } = await uploadLibraryFile(file);
      setNewBook({ ...newBook, pdfUrl: url });
    } catch (err) {
      console.error('File upload failed', err);
      alert('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const classes = Array.from({ length: 12 }, (_, i) => i + 1);

  const categories = [
    { id: 'school', name: 'School (1-12)' },
    { id: 'engg', name: 'Engineering' },
    { id: 'mbbs', name: 'MBBS / Medical' },
    { id: 'iti', name: 'ITI / Technical' },
    { id: 'cet', name: 'Entrance (MHT-CET)' },
  ];

  const demoBooks = [
    { id: 'd1', title: 'Mathematics Part I', class: 10, category: 'school', subject: 'Maths', board: 'Maharashtra State Board' },
    { id: 'd2', title: 'Mathematics Part II', class: 10, category: 'school', subject: 'Maths', board: 'Maharashtra State Board' },
    { id: 'd3', title: 'Science and Technology I', class: 10, category: 'school', subject: 'Science', board: 'Maharashtra State Board' },
    { id: 'd4', title: 'Kumarbharati (English)', class: 10, category: 'school', subject: 'Language', board: 'Maharashtra State Board' },
    { id: 'd5', title: 'Physics', class: 12, category: 'school', subject: 'Science', board: 'Maharashtra State Board' },
    { id: 'd6', title: 'Chemistry', class: 12, category: 'school', subject: 'Science', board: 'Maharashtra State Board' },
    { id: 'd7', title: 'Engineering Mathematics-I', category: 'engg', subject: 'Maths', board: 'Pune University' },
    { id: 'd8', title: 'Gray\'s Anatomy', category: 'mbbs', subject: 'Anatomy', board: 'Standard Reference' },
    { id: 'd9', title: 'MHT-CET Physics MCQ Pack', category: 'cet', subject: 'Physics', board: 'Entrance Material' },
  ];

  const filteredBooks = [...demoBooks, ...allBooks].filter(b => 
    b.category === category && (category === 'school' ? Number(b.class) === Number(selectedClass) : true)
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1 style={{ fontSize: '2.5rem' }}>Digital Library</h1>
          {user?.role === 'Admin' && (
            <button className="glass" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', background: 'var(--primary)', color: 'white', fontWeight: 700, border: 'none' }}>
              <Plus size={20} /> Add New Book
            </button>
          )}
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>Free Textbooks & Study Materials</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-md)', overflowX: 'auto', paddingBottom: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
        {categories.map(cat => (
          <button 
            key={cat.id} 
            className="glass" 
            onClick={() => setCategory(cat.id)}
            style={{ 
              padding: '10px 20px', 
              borderRadius: '20px', 
              whiteSpace: 'nowrap',
              background: category === cat.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: category === cat.id ? 'white' : 'var(--text-primary)',
              border: 'none',
              fontWeight: 600
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {category === 'school' && (
        <>
          <h2 style={{ marginBottom: 'var(--spacing-lg)', fontSize: '1.2rem' }}>Select Your Class</h2>
          <div className={styles.classGrid}>
            {classes.map(c => (
              <div 
                key={c} 
                className={`${styles.classCard} glass-card`}
                onClick={() => setSelectedClass(c)}
                style={{ borderColor: selectedClass === c ? 'var(--primary)' : 'transparent' }}
              >
                <span className={styles.classNumber}>{c}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Class</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <h2 style={{ fontSize: '1.5rem' }}>
          {category === 'school' ? `Textbooks for Class ${selectedClass}` : `${categories.find(c => c.id === category)?.name} Materials`}
        </h2>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{filteredBooks.length} Books Found</span>
      </div>

      <div className={styles.bookGrid}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <div key={book.id} className={`${styles.bookCard} glass-card`}>
              <div className={styles.bookIcon}>
                <Book size={32} />
              </div>
              <div className={styles.bookInfo}>
                <h3 className={styles.bookTitle}>{book.title}</h3>
                <p className={styles.bookMeta}>{book.board}</p>
                <a href={book.pdfUrl} target="_blank" rel="noreferrer" className={styles.downloadBtn}>
                  <Download size={16} /> Download PDF
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card" style={{ gridColumn: '1/-1', padding: '3rem', textAlign: 'center' }}>
            <LibraryIcon size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No books added for this category yet.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} glass-card`}>
            <div className={styles.modalHeader}>
              <h3>Add New Textbook</h3>
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            <form onSubmit={handleAddBook} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div className="inputGroup">
                <label>Book Title</label>
                <input 
                  className={styles.inputField} 
                  required 
                  value={newBook.title}
                  onChange={e => setNewBook({...newBook, title: e.target.value})}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="inputGroup">
                  <label>Category</label>
                  <select 
                    className={styles.inputField} 
                    value={newBook.category}
                    onChange={e => setNewBook({...newBook, category: e.target.value})}
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                {newBook.category === 'school' && (
                  <div className="inputGroup">
                    <label>Class</label>
                    <input 
                      type="number" 
                      className={styles.inputField} 
                      value={newBook.class}
                      onChange={e => setNewBook({...newBook, class: e.target.value})}
                    />
                  </div>
                )}
              </div>
              <div className="inputGroup">
                <label>Subject</label>
                <input 
                  className={styles.inputField} 
                  required 
                  value={newBook.subject}
                  onChange={e => setNewBook({...newBook, subject: e.target.value})}
                />
              </div>
              <div className="inputGroup">
                <label>Upload PDF / Excel File</label>
                <input 
                  type="file"
                  accept=".pdf,.xlsx,.xls,.doc,.docx"
                  className={styles.inputField}
                  onChange={handleFileUpload}
                  style={{ padding: '8px' }}
                />
              </div>
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>OR</div>
              <div className="inputGroup">
                <label>Paste PDF URL / Link</label>
                <input 
                  className={styles.inputField} 
                  value={newBook.pdfUrl}
                  onChange={e => setNewBook({...newBook, pdfUrl: e.target.value})}
                />
              </div>
              <button type="submit" disabled={isUploading} className="glass" style={{ background: 'var(--primary)', color: 'white', padding: '12px', borderRadius: '10px', marginTop: '10px', fontWeight: 700, opacity: isUploading ? 0.7 : 1 }}>
                {isUploading ? 'Uploading File...' : 'Upload to Library'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
