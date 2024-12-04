import React, { useState } from 'react';

const UpdatePackagePage = () => {
  const [packageName, setPackageName] = useState('');
  const [rating, setRating] = useState('');
  const [cost, setCost] = useState('');

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/packages/${packageName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, cost }),
      });

      if (response.ok) {
        alert('Package updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update package: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating package:', error);
    }
  };

  return (
    <div className="section">
      <h2>Update Package</h2>
      <input
        type="text"
        placeholder="Enter package name"
        value={packageName}
        onChange={(e) => setPackageName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter new rating"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter new cost"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
      />
      <button className="primary-button" onClick={handleUpdate}>
        Update Package
      </button>
    </div>
  );
};

export default UpdatePackagePage;
