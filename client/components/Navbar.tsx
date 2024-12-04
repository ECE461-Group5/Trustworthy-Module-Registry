import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar">
      <h1>Welcome to ECE 461 Group 5 Project</h1>
      <div className="button-group">
        <Link to="/load-packages">
          <button className="primary-button">Load Packages</button>
        </Link>
        <Link to="/upload-package">
          <button className="secondary-button">Upload Package</button>
        </Link>
        <Link to="/reset-database">
          <button className="reset-button">Reset DB</button>
        </Link>
        <Link to="/search-package">
          <button className="put-button">Search Package</button>
        </Link>
        <Link to="/update-package">
          <button className="update-button">Update Package</button>
        </Link>
        <Link to="/view-history">
          <button className="history-button">View History</button>
        </Link>
        <Link to="/features">
          <button className="features-button">Features</button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

