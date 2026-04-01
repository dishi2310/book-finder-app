import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://gutendex.com/books');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBooks(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>📚 Public Books Explorer</h1>
        <p>Discover classic literature dynamically fetched from Gutendex API</p>
      </header>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading books for you...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>⚠️ Error loading books: {error}</p>
        </div>
      ) : (
        <main className="books-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-image-container">
                {book.formats['image/jpeg'] ? (
                  <img
                    src={book.formats['image/jpeg']}
                    alt={`Cover of ${book.title}`}
                    className="book-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="placeholder-cover">No Cover</div>
                )}
              </div>
              <div className="book-info">
                <h2 className="book-title">{book.title}</h2>
                <h3 className="book-author">
                  {book.authors && book.authors.length > 0
                    ? book.authors[0].name
                    : 'Unknown Author'}
                </h3>
                <div className="book-subjects">
                  {book.subjects && book.subjects.slice(0, 2).map((subject, idx) => {
                    const cleanSubject = subject.split(' -- ')[0];
                    return (
                      <span key={idx} className="subject-tag" title={cleanSubject}>
                        {cleanSubject}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </main>
      )}
    </div>
  );
}

export default App;
