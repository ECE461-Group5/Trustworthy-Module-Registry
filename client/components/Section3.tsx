/*
Author: Djamel Almabouada
This is the component that displays the third section of the upload package page
*/

import React from "react";

const Section3 = () => {
  return (
    <div className="section">
      <h2>NPM Package URL:</h2>
      <input type="text" placeholder="Enter npmjs package URL" />
      <h2>Package File (zip):</h2>
      <input type="file" />
      <p>Status: Ready</p>
      <button className="primary-button">Download Package</button>
    </div>
  );
};

export default Section3;
