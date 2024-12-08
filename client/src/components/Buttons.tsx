/*
Author(s): Djamel Almabouada, Derek Petersen, Geromy Cunningham
Purpose: Class for Different Buttons  
*/

// import React from 'react';
// import Button from './Buttons';

function Buttons() {
  const handleLoginClick = () => {
    alert("Login Clicked!");
  };
  
  const handleTracks = () => {
    alert("Display Tracks Here!");
  };

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
