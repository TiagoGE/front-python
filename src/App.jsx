import { useEffect, useState } from 'react'

import './App.css'

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState(0);
  const [newTitle, setNewTitle] = useState("");

  //Hook that will execute once the page renders
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("https://api-python-anjz.onrender.com/api/books/");
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addbook = async () => {
    const bookData = {
      title,
      release_year: releaseYear,
    };
    try {
      const response = await fetch("hhttps://api-python-anjz.onrender.com/api/books/create/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      const data = await response.json()
      setBooks((prev) => [...prev, data]);

      //Clear inputs
      setTitle("");
      setReleaseYear(0);
    } catch (err) {
      console.log(err);
    }
  };

  const updateTitle = async (pk, release_year) => {
    const bookData = {
      title: newTitle,
      release_year,
    };
    try {
      const response = await fetch(`https://api-python-anjz.onrender.com/api/books/${pk}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      const data = await response.json()
      setBooks((prev) => prev.map((book) => {
        if (book.id == pk) {
          return data;
        }
        else return book;
      }));
    } catch (err) {
      console.log(err);
    }
  }

  const deleteBook = async (pk) => {
    try {
      await fetch(`https://api-python-anjz.onrender.com/api/books/${pk}`, {
        method: "DELETE",
      });

      setBooks((prev) => prev.filter((book) => book.id !== pk));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <h1>Book Website</h1>

      <div>
        <input
          type='text'
          placeholder='Book Title...'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type='number'
          placeholder='Release Year...'
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
        />

        <button onClick={addbook}>Add Book</button>
      </div>
      {books.map((book, key) => (
        <div key={key}>
          <p>Title: {book.title}</p>
          <p>Released Year: {book.release_year}</p>
          <input
            type='text'
            placeholder='New Title...'
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button onClick={() => updateTitle(book.id, book.release_year)}>Change Title</button>
          <button onClick={() => deleteBook(book.id)}>Delete</button>
        </div>
      ))}
    </>
  )
}

export default App
