/*
Author: Djamel Almabouada
This is the components that displasys the features and their pages
*/

import React from 'react';

const FeaturesPage = () => {
  const features = [
    { feature: 'Load all packages', page: 'LoadPackagesPage.tsx' },
    { feature: 'Reset database', page: 'ResetDatabasePage.tsx' },
    { feature: 'Ratings and cost display', page: 'LoadPackagesPage.tsx' },
    { feature: 'Update package', page: 'UpdatePackagePage.tsx' },
    { feature: 'Search package by name', page: 'SearchPackagePage.tsx' },
    { feature: 'Upload package', page: 'UploadPackagePage.tsx' },
    { feature: 'View package history', page: 'ViewPackageHistoryPage.tsx' },
    { feature: 'Delete specific package', page: 'LoadPackagesPage.tsx' },
  ];

  return (
    <div className="section">
      <h2>Feature Implementation Overview</h2>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Implemented in Page</th>
          </tr>
        </thead>
        <tbody>
          {features.map((item, index) => (
            <tr key={index}>
              <td>{item.feature}</td>
              <td>{item.page}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeaturesPage;