/*
Author: Djamel Almabouada
This is the component that displays the first section of the upload package page
*/

import React from "react";


const Section1 = () => {
  return (
    <div className="section">
      <h2>NPM Package URL:</h2>
      <input type="text" placeholder="Enter npmjs package URL" />
      <h2>Package File (zip):</h2>
      <input type="file" />
      <p>Status: Ready</p>
      <div className="button-group">
        <button className="primary-button">Upload Package</button>
        <button className="secondary-button">Update Package</button>
      </div>
    </div>
  );
};

export default Section1;
