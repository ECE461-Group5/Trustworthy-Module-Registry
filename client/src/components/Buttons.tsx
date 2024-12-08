/*
Author(s): Djamel Almabouada, Derek Petersen, Geromy Cunningham
Purpose: Class for Different Buttons  
*/

// import React from 'react';
// import Button from './Buttons';

function handleTracks(e: { preventDefault: () => void; }) {
  e.preventDefault();
  fetch("/api/tracks")  // Update the endpoint to match the server
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log("Tracks data:", data);
          // Handle the received data here
        });
      } else {
        console.error("Server responded with an error:", response.statusText);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function Buttons() {
  const handleLoginClick = () => {
    alert("Login Clicked!");
  };
  
  // const handleTracks = () => {
  //   alert("Display Tracks Here!");
  // };

  const handleReset = () => {
    alert("Directory Reset!");
  };


  return (
    <div className="buttons">
      <input
        type="text"
        id="Username"
        placeholder="Username"
        aria-required="true"
      />
      <button className="login" onClick={handleLoginClick}>
        Login
        {/* Sign-in */}
      </button>
      <button className="tracks" onClick={handleTracks}>
        Tracks
        {/* Register-User */}
      </button>
      <button className="reset" onClick={handleReset}>
        Reset Directory
        {/* Reset Packages */}
      </button>
      
    </div>
  );
}

export default Buttons;
