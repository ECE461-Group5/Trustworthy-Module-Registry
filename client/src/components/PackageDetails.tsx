import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Define the PackageData interface
interface PackageData {
  Content: string;
  URL: string;
  debloat: boolean;
  JSProgram: string;
}

const PackageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/package/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch package with ID: ${id}`);
        }
        return response.json();
      })
      .then((data) => setPackageData(data))
      .catch((error) => setError(error.message));
  }, [id]);

  return (
    <div>
      <h1>Package Details</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : packageData ? (
        <div>
          <p><strong>Content:</strong> {packageData.Content}</p>
          <p><strong>URL:</strong> <a href={packageData.URL}>{packageData.URL}</a></p>
          <p><strong>Debloat:</strong> {packageData.debloat ? "Yes" : "No"}</p>
          <p><strong>JS Program:</strong> {packageData.JSProgram}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PackageDetails;
