/*
Author: Djamel Almabouada
This is the component that displays the navbar
*/

import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import '../stylings/Navbar.css';

// define the type of the user object
interface User {
  name: string;
}
// Function to fetch user info (replace with your endpoint)
const fetchUserInfo = async () => {
  const response = await axios.get('/api/user', {
    headers: {
      'X-Authorization': 'XXXXX', // token goes here
    },
  });
  return response.data as User;
};

const Navbar: React.FC = () => {
  const { data: user, isLoading, isError } = useQuery<User>({
    queryKey: ['userInfo'],
    queryFn: fetchUserInfo,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <nav className="navbar">
        <h1 className="navbar-title">ECE 461 Project</h1>
        <p>Loading user...</p>
      </nav>
    );
  }

  if (isError) {
    return (
      <nav className="navbar">
        <h1 className="navbar-title">ECE 461 Project</h1>
        <p>Failed to load user info</p>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <h1 className="navbar-title">ECE 461 Project</h1>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/upload" className="navbar-link">Upload</Link>
        <Link to="/directory" className="navbar-link">Directory</Link>
        <Link to="/tracks" className="navbar-link">Tracks</Link>
        <Link to="/delete" className="navbar-link">Delete</Link>
      </div>
      <div className="navbar-user">
        <p>Welcome, {user?.name || 'Guest'}!</p>
      </div>
    </nav>
  );
};

export default Navbar;
