/*
Author(s): Djamel Almabouada, Derek Petersen, Geromy Cunningham
Purpose: Class for Different Buttons  
*/

import React, { useState } from "react";
import axios from "axios";

const API_URL = "/api/packages"; // Proxy path for the /packages endpoint

interface Package {
    id: number;       // Unique identifier for the package
    name: string;     // Name of the package
    version: string;  // Version of the package
  }

const Buttons: React.FC = () => {

  const [packages, setPackages] = useState<Package[]>([]); // State for storing package data

  const handleDeleteClick = () => {
    alert("Delete Button Clicked!");
  };

  const handleLoadClick = async () => {
    try {
      const response = await axios.get<Package[]>(API_URL); // Specify the expected response type
      console.log("Packages Loaded:", response.data);
      setPackages(response.data); // Store the data in state
    } catch (error) {
      console.error("Error loading packages:", error);
      alert("Failed to load packages. Please try again.");
    }
  };

  const handleResetClick = () => {
    alert("Reset Button Clicked!");
  };

  const handlePutClick = () => {
    alert("Put Button Clicked!");
  };

  return (
    <div className="buttons">
      <button className="primary-button" onClick={handleDeleteClick}>
        Delete Button

      </button>

      <button className="load-button" onClick={handleLoadClick}>
        Load Registry

        {packages.length > 0 && (
        <div className="packages-list">
          <h3>Loaded Packages:</h3>
          <ul>
            {packages.map((pkg) => (
              <li key={pkg.id}>
                {pkg.name} (v{pkg.version})
              </li>
            ))}
          </ul>
        </div>
      )}
      </button>

      <button className="reset-button" onClick={handleResetClick}>
        Reset Button

      </button>

      <button className="put-button" onClick={handlePutClick}>
        Put Button

      </button>
    </div>
  );
}

export default Buttons;
