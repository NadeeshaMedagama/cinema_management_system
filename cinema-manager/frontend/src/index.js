import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Set background image
document.body.style.backgroundImage = "url('/movie-collage-bg.jpg')";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
