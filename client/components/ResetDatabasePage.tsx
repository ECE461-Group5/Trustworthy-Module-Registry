/*
Author: Djamel Almabouada
This is the component that does reset the database
*/

import React from 'react';

const ResetDatabasePage = () => {
  const handleReset = async () => {
    try {
      await fetch('/api/packages/reset', { method: 'DELETE' }); // Adjust API endpoint
      alert('Database reset successfully!');
    } catch (error) {
      console.error('Error resetting database:', error);
    }
  };

  return (
    <div className="section">
      <h2>Reset Database</h2>
      <button className="reset-button" onClick={handleReset}>
        Reset DB
      </button>
    </div>
  );
};

export default ResetDatabasePage;
