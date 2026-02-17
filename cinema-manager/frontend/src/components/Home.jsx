import React from 'react';
import Navbar from './Navbar';
import MovieList from './MovieList';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <div className="hero-section">
        <h1>Welcome to Cinema</h1>
        <p>Experience the magic of movies like never before</p>
      </div>
      <MovieList />
    </div>
  );
}

export default Home;
