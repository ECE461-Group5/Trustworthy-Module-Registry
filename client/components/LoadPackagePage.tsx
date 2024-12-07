/*
Author: Djamel Almabouada
This is the load package component which displays the packages and their details, and handles the deletion of a package
*/

import React, { useState } from 'react';

const LoadPackagesPage = () => {
  // Define the Package interface
  interface Package {
    name: string;
    rating: number;
    cost: number;
  }

  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Fetch all packages from the database
  const handleLoadPackages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/packages'); // Replace with your API endpoint
      const data: Package[] = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a specific package
  const handleDelete = async (packageName: string) => {
    try {
      const response = await fetch(`/api/packages/${packageName}`, { method: 'DELETE' });
      if (response.ok) {
        alert(`${packageName} deleted successfully!`);
        // Remove the deleted package from the list
        setPackages(packages.filter((pkg) => pkg.name !== packageName));
      } else {
        const errorData = await response.json();
        alert(`Failed to delete package: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  return (
    <div className="section">
      <h2>All Packages</h2>
      <button className="primary-button" onClick={handleLoadPackages} disabled={isLoading}>
        {isLoading ? 'Listing...' : 'List Packages'}
      </button>
      {packages.length > 0 ? (
        <div>
          {packages.map((pkg, index) => (
            <div key={index} className="package-item">
              <h3>{pkg.name}</h3>
              <p>Rating: {pkg.rating}</p>
              <p>Cost: ${pkg.cost}</p>
              <button
                className="secondary-button"
                onClick={() => handleDelete(pkg.name)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && <p>No packages available. Click "List Packages" to fetch data.</p>
      )}
    </div>
  );
};

export default LoadPackagesPage;

