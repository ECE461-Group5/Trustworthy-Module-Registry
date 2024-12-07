/*
Author: Djamel Almabouada
This is the component that displays the second section of the upload package page
*/

import React from "react";

const Section2 = () => {
  return (
    <div className="section">
      <h2>Search URL:</h2>
      <input type="text" placeholder="Enter a URL" />
      <button className="primary-button">Search</button>
    </div>
  );
};

export default Section2;
