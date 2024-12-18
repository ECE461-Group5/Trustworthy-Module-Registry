/*
Author(s): Djamel Almabouada, Derek Petersen, Geromy Cunningham
Purpose: Navigation bar for the main page
*/

import React from "react";
import { Link } from "react-router-dom";

const MainNavbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src="/p.jpg" alt="Logo" />
        </Link>
        <Link to="/" className="logo-text" title="Home Page">
          ECE461: Group 5
        </Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/directory">Directory</Link>
        </li>
        <li>
          <Link to="/upload">Upload</Link>
        </li>
        <li>
          <Link to="/options">Options</Link>
        </li>
      </ul>
    </nav>
  );
};

export default MainNavbar;
