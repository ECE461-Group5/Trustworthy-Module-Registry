/*
Author(s): Djamel Almabouada, Derek Petersen, Geromy Cunningham
Purpose: Class for Different Buttons  
*/

// import React from 'react';
// import Button from './Buttons';

async function handleTracks(url: { preventDefault: () => void; }) {
  url.preventDefault();
  fetch("/tracks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log("Tracks data:", data);
        });
      } else {
        console.error("Server responded with an error:", response.statusText);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

async function handleReset(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();
  fetch("/reset", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log("Reset response:", data);
          alert("Registry has been reset successfully.");
        });
      } else {
        console.error("Server responded with an error:", response.statusText);
        alert("Failed to reset the registry.");
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      alert("An error occurred while resetting the registry.");
    });
}

function Buttons() {
  const handleLoginClick = () => {
    alert("Login Clicked!");
  };
  
  // const handleTracks = () => {
  //   alert("Display Tracks Here!");
  // };

  // const handleReset = () => {
  //   alert("Directory Reset!");
  // };


  return (
  
  <div className="upload-package-page">
    <div className="form-group">
    <label htmlFor="searchType">Options:</label>
      <input
        type="text"
        id="Username"
        placeholder="Username"
        aria-required="true"
      />
      <input
        type="text"
        id="Password"
        placeholder="Password"
        aria-required="true"
      />
      <div className="buttons">
        <button className="login" onClick={handleLoginClick}>
          Login
          {/* Sign-in */}
        </button>
        <button className="tracks" onClick={handleTracks}>
          Tracks
          {/* Show tracks */}
        </button>
        <button className="reset" onClick={handleReset}>
          Reset Directory
          {/* Reset Packages */}
        </button>
      </div>
    </div>
  </div>
  );
}

export default Buttons;
