import React, { useState } from 'react';

const ViewPackageHistoryPage = () => {
  const [packageName, setPackageName] = useState('');
  interface HistoryItem {
    version: string;
    updatedAt: string;
    changes: string;
  }

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleFetchHistory = async () => {
    try {
      const response = await fetch(`/api/packages/${packageName}/history`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching package history:', error);
    }
  };

  return (
    <div className="section">
      <h2>View Package History</h2>
      <input
        type="text"
        placeholder="Enter package name"
        value={packageName}
        onChange={(e) => setPackageName(e.target.value)}
      />
      <button className="primary-button" onClick={handleFetchHistory}>
        View History
      </button>
      {history.length > 0 && (
        <div>
          <h3>History</h3>
          <ul>
            {history.map((item, index) => (
              <li key={index}>
                <p>Version: {item.version}</p>
                <p>Updated At: {item.updatedAt}</p>
                <p>Changes: {item.changes}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewPackageHistoryPage;
