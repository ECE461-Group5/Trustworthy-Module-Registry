/*
Author(s): Djamel Almabouada, Derek Petersen, Geromy Cunningham
Purpose: Class for Different Buttons  
*/

// import React from 'react';
// import Button from './Buttons';

function Buttons() {
  const handlePrimaryClick = () => {
    alert("Primary Button Clicked!");
  };

  const handleSecondaryClick = () => {
    alert("Secondary Button Clicked!");
  };

  const handleResetClick = () => {
    alert("Get Button Clicked!");
  };

  const handlePutClick = () => {
    alert("Put Button Clicked!");
  };

  return (
    <div className="buttons">
      <button className="primary-button" onClick={handlePrimaryClick}>
        Primary Button
        {/* Sign-in */}
      </button>
      <button className="secondary-button" onClick={handleSecondaryClick}>
        Secondary Button
        {/* Register-User */}
      </button>
      <button className="reset-button" onClick={handleResetClick}>
        Reset Button
        {/* Reset Packages */}
      </button>
      <button className="-button" onClick={handlePutClick}>
        Put Button
        {/* Register-User */}
      </button>
    </div>
  );
}

export default Buttons;
