/*
Author: Djamel Almabouada
This is the search package component which displays the package details and handles the search
*/
import React, { useState } from 'react';

const SearchPackagePage = () => {
  const [packageName, setPackageName] = useState('');
  interface PackageData {
    name: string;
    rating: number;
    cost: number;
  }

  const [packageData, setPackageData] = useState<PackageData | null>(null);

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/packages/${packageName}`); 
      const data = await response.json();
      setPackageData(data);
    } catch (error) {
      console.error('Error fetching package:', error);
    }
  };

  return (
    <div className="section">
      <h2>Search Package</h2>
      <input
        type="text"
        placeholder="Enter package name"
        value={packageName}
        onChange={(e) => setPackageName(e.target.value)}
      />
      <button className="primary-button" onClick={handleSearch}>
        Search
      </button>
      {packageData && (
        <div>
          <h3>{packageData.name}</h3>
          <p>Rating: {packageData.rating}</p>
          <p>Cost: {packageData.cost}</p>
        </div>
      )}
    </div>
  );
};

export default SearchPackagePage;
