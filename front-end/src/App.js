import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const url = 'http://localhost:3001';

  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    showMovies();
    console.log('movies:', movies);
  }, [searchTerm]);

  const showMovies = () => {
    if (searchTerm === '') {
      fetch(url + '/movies')
        .then((res) => res.json())
        .then((movies) => setMovies(movies));
    } else {
      fetch(url + '/search?title=' + searchTerm)
        .then((res) => res.json())
        .then((movies) => setMovies(movies));
    }
  };

  const addMovie = (movie) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movie),
    };
    fetch(url + '/movies', fetchOptions)
      .then((res) => res.json())
      .then((movies) => setMovies(movies));
    console.log('movies:', movies);
  };

  const deleteMovie = async (movie) => {
    let id = typeof movie === 'number' ? movie : movie.id;
    const fetchOptions = {
      method: 'DELETE',
    };
    await fetch(url + '/movies/' + id, fetchOptions);
    await showMovies();
  };

  const handleMovieSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const formJSON = Object.fromEntries(formData.entries());

    addMovie(formJSON);
  };

  const handleSearchChange = (event) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
  };

  const handleWatchChange = (event) => {
    // TODO: implement
  };
  
  const handleToWatchChange = (event) => {
    // TODO: implement
  };

  return (
    <div className="App">
      <header className="App-header">
        <label htmlFor="search">Search</label>
        <input
          name="search"
          onChange={handleSearchChange}
          type="text"
          placeholder="Title"
        />
        <br />
        Add Movie
        <form onSubmit={handleMovieSubmit}>
          <label htmlFor="title">Title</label>
          <input name="title" type="text" />
          <input type="submit" />
        </form>
        <h2>Movies List:</h2>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <p key={movie.id}>
              <span>
                <button onClick={() => deleteMovie(movie)}>Delete</button>
              </span>
              {movie.id}: {movie.title}
              <br />
              <span>
                <label htmlFor="watched">watched?</label>
                {movie.watched ? (
                  <input
                    name="watched"
                    type="checkbox"
                    checked
                    onchange={handleWatchChange}
                  />
                ) : (
                  <input
                    name="watched"
                    type="checkbox"
                    onchange={handleWatchChange}
                  />
                )}
              </span>
              <br />
              <span>
                <label htmlFor="to_watch">to_watch?</label>
                {movie.to_watch ? (
                  <input
                    name="to_watch"
                    type="checkbox"
                    checked
                    onchange={handleToWatchChange}
                  />
                ) : (
                  <input
                    name="to_watch"
                    type="checkbox"
                    onchange={handleToWatchChange}
                  />
                )}
                <input name="to_watch" type="checkbox" />
              </span>
            </p>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </header>
    </div>
  );
}

export default App;
