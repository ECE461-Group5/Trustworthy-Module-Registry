/*
Author: Djamel Almabouada
This is the component that displays the home page
*/

import { Link } from 'react-router-dom';
import '../stylings/HomePage.css';


const HomePage = () => {
  return (
    <div className="home-page">
      {/* Title */}
      <h1 className="home-title">Welcome to ECE 461 Group 5 Project</h1>
      
      {/* Main Buttons */}
      <div className="main-buttons">
        <Link to="/">
          <button className="home-button">HOME</button>
        </Link>
        <Link to="/upload-package">
          <button className="upload-button">UPLOAD</button>
        </Link>
        <Link to="/directory">
          <button className="directory-button">DIRECTORY</button>
        </Link>
      </div>

      {/* Logo */}
      <div className="logo-container">
        <img src="/public/new_logo.png" alt="Company Logo" className="logo-image" />
      </div>

      {/* Footer Buttons */}
      <div className="footer-buttons">
        <Link to="/tracks">
          <button className="tracks-button">TRACKS</button>
        </Link>
        <Link to="/delete">
          <button className="delete-button">DELETE</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
