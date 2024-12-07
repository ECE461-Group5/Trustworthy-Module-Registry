/*
Author: Djamel Almabouada
Purpose: This is the component that displays the directory page
*/

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import '../stylings/DirectoryPage.css';
import '../stylings/Navbar.css';
import Navbar from './Navbar';


// TypeScript Interfaces
interface Package {
  ID: string;
  Version: string;
  Name: string;
}

interface Rating {
  comment: string;
  stars: number;
}

interface Cost {
  description: string;
  amount: number;
}

// Fetch packages with optional search filters
const fetchPackages = async (searchInput = '', offset = 0): Promise<Package[]> => {
  const response = await axios.post(
    `http://54.198.116.182/packages?offset=${offset}`,
    [
      {
        Name: searchInput || '',
        Version: '',
      },
    ],
    {
      headers: {
        'X-Authorization': 'token_goes_here',
      },
    }
  );
  return response.data as any[];
};

// Ratings Modal Component
const RatingsModal: React.FC<{ ratings: Rating[]; onClose: () => void }> = ({ ratings, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Package Ratings</h2>
      <ul>
        {ratings.length > 0 ? (
          ratings.map((rating, index) => (
            <li key={index}>
              {rating.comment} - {rating.stars} stars
            </li>
          ))
        ) : (
          <p>No ratings available for this package.</p>
        )}
      </ul>
      <button onClick={onClose} className="close-button">
        Close
      </button>
    </div>
  </div>
);

// Cost Modal Component
const CostModal: React.FC<{ cost: Cost[]; onClose: () => void }> = ({ cost, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Cost Details</h2>
      <ul>
        {cost.length > 0 ? (
          cost.map((item, index) => (
            <li key={index}>
              {item.description}: ${item.amount}
            </li>
          ))
        ) : (
          <p>No cost details available for this package.</p>
        )}
      </ul>
      <button onClick={onClose} className="close-button">
        Close
      </button>
    </div>
  </div>
);

// Update Modal Component
const UpdateModal: React.FC<{
  pkg: Package;
  onClose: () => void;
  onUpdate: (updatedPackage: Package) => void;
}> = ({ pkg, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(pkg);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onUpdate(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Package</h2>
        <input
          type="text"
          name="Name"
          value={formData.Name}
          onChange={handleChange}
          placeholder="Package Name"
        />
        <input
          type="text"
          name="Version"
          value={formData.Version}
          onChange={handleChange}
          placeholder="Package Version"
        />
        <button onClick={handleSubmit} className="save-button">
          Save
        </button>
        <button onClick={onClose} className="close-button">
          Cancel
        </button>
      </div>
    </div>
  );
};

// DirectoryPage Component
const DirectoryPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchType, setSearchType] = useState<'ID' | 'RegEx' | 'NAME'>('NAME');
  const [showRatingsModal, setShowRatingsModal] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [cost, setCost] = useState<Cost[]>([]);
  const [showCostModal, setShowCostModal] = useState(false);

  const { data = [], isLoading, isError, refetch } = useQuery<Package[]>({
    queryKey: ['packages', searchInput, searchType],
    queryFn: () => fetchPackages(searchInput),
    refetchOnWindowFocus: false,
  });

  // Handle Ratings Button
  const handleRatingsClick = async (id: string) => {
    try {
      const response = await axios.get(`http://54.198.116.182/${id}`);
      setRatings(response.data as Rating[]);
      setShowRatingsModal(true);
    } catch (error) {
      console.error('Failed to fetch ratings:', error);
      alert('Failed to fetch ratings. Please try again.');
    }
  };

  // Handle Cost Button
  const handleCostClick = async (id: string) => {
    try {
      const response = await axios.get(`http://54.198.116.182/packages/${id}/cost`, {
        headers: { 'X-Authorization': 'token-goes-here' },
      });

      if (Array.isArray(response.data)) {
        setCost(response.data as Cost[]);
        setShowCostModal(true);
      } else {
        console.error('Unexpected cost data:', response.data);
        alert('Invalid cost data received.');
      }
    } catch (error) {
      console.error('Failed to fetch cost data:', error);
      alert('Failed to fetch cost. Please try again.');
    }
  };

  // Handle Update Button
  const handleUpdateClick = async (id: string) => {
    try {
      const response = await axios.get(`http://54.198.116.182/packages/${id}`, {
        headers: { 'X-Authorization': 'your-auth-token' },
      });
      setSelectedPackage(response.data as Package);
      setShowUpdateModal(true);
    } catch (error) {
      console.error('Failed to fetch package details:', error);
      alert('Failed to fetch package details. Please try again.');
    }
  };

  const handleUpdateSubmit = async (updatedPackage: Package) => {
    try {
      await axios.put(`http://54.198.116.182/packages/${updatedPackage.ID}`, updatedPackage, {
        headers: { 'X-Authorization': 'your-auth-token' },
      });
      alert('Package updated successfully.');
      refetch();
    } catch (error) {
      console.error('Failed to update package:', error);
      alert('Failed to update the package. Please try again.');
    }
  };

  // Handle Delete Button
  const handleDeleteClick = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete package ID: ${id}?`)) {
      try {
        await axios.delete(`http://54.198.116.182/packages/${id}`, {
          headers: { 'X-Authorization': 'your-auth-token' },
        });
        alert('Package deleted successfully.');
        refetch();
      } catch (error) {
        console.error('Failed to delete package:', error);
        alert('Failed to delete the package. Please try again.');
      }
    }
  };

  if (isLoading) return <p>Loading packages...</p>;
  if (isError) return <p>Failed to load packages. Please try again later.</p>;

  return (
    <div>
      <Navbar />
      <div className="directory-page">
        <h1>Packages Directory</h1>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search Input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button onClick={() => { setSearchType('ID'); refetch(); }} className="search-button">
            GET ID
          </button>
          <button onClick={() => { setSearchType('RegEx'); refetch(); }} className="regex-button">
            RegEx
          </button>
          <button onClick={() => { setSearchType('NAME'); refetch(); }} className="name-button">
            NAME
          </button>
        </div>

        <table className="packages-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Version</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((pkg) => (
              <tr key={pkg.ID}>
                <td>{pkg.ID}</td>
                <td>{pkg.Version}</td>
                <td>{pkg.Name}</td>
                <td>
                  <button onClick={() => handleRatingsClick(pkg.ID)} className="ratings-button">
                    Ratings
                  </button>
                  <button onClick={() => handleCostClick(pkg.ID)} className="cost-button">
                    Cost
                  </button>
                  <button onClick={() => handleUpdateClick(pkg.ID)} className="update-button">
                    Update
                  </button>
                  <button onClick={() => handleDeleteClick(pkg.ID)} className="delete-button">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showRatingsModal && <RatingsModal ratings={ratings} onClose={() => setShowRatingsModal(false)} />}
        {showCostModal && <CostModal cost={cost} onClose={() => setShowCostModal(false)} />}
        {showUpdateModal && selectedPackage && (
          <UpdateModal
            pkg={selectedPackage}
            onClose={() => setShowUpdateModal(false)}
            onUpdate={handleUpdateSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default DirectoryPage;















































// import React, { useState, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// //import axios from 'axios';
// import '../stylings/DirectoryPage.css';
// import '../stylings/Navbar.css';
// import Navbar from './Navbar';

// // Mock Fetch Packages
// const fetchPackages = async (): Promise<any[]> => {
//   console.log('Fetching packages from mock API');
//   return [
//     { ID: '1', Version: '1.0', Name: 'Package A', Cost: '$10' },
//     { ID: '2', Version: '1.1', Name: 'Package B', Cost: '$15' },
//     { ID: '3', Version: '2.0', Name: 'Package C', Cost: '$20' },
//     { ID: '4', Version: '3.0', Name: 'Package D', Cost: '$25' },
//     { ID: '5', Version: '1.2', Name: 'Package E', Cost: '$30' },
//     { ID: '6', Version: '2.3', Name: 'Package F', Cost: '$35' },
//     { ID: '7', Version: '4.0', Name: 'Package G', Cost: '$40' },
//     { ID: '8', Version: '1.4', Name: 'Package H', Cost: '$45' },
//     { ID: '9', Version: '2.5', Name: 'Package I', Cost: '$50' },
//     { ID: '10', Version: '3.1', Name: 'Package J', Cost: '$55' },
//     { ID: '11', Version: '1.0', Name: 'Package K', Cost: '$60' },  
//   ];
// };

// // Ratings Modal
// const RatingsModal: React.FC<{ ratings: any[]; onClose: () => void }> = ({ ratings, onClose }) => (
//   <div className="modal-overlay">
//     <div className="modal-content">
//       <h2>Package Ratings</h2>
//       <ul>
//         {ratings.map((rating, index) => (
//           <li key={index}>
//             {rating.comment} - {rating.stars} stars
//           </li>
//         ))}
//       </ul>
//       <button onClick={onClose} className="close-button">
//         Close
//       </button>
//     </div>
//   </div>
// );

// // Cost Modal
// const CostModal: React.FC<{ cost: string; onClose: () => void }> = ({ cost, onClose }) => (
//   <div className="modal-overlay">
//     <div className="modal-content">
//       <h2>Package Cost</h2>
//       <p>{cost}</p>
//       <button onClick={onClose} className="close-button">
//         Close
//       </button>
//     </div>
//   </div>
// );

// const DirectoryPage: React.FC = () => {
//   const [ratings, setRatings] = useState<any[]>([]);
//   const [showRatingsModal, setShowRatingsModal] = useState(false);
//   const [cost, setCost] = useState<string>('');
//   const [showCostModal, setShowCostModal] = useState(false);

//   const { data = [], isLoading, isError } = useQuery({
//     queryKey: ['package'],
//     queryFn: fetchPackages,
//   });

//   useEffect(() => {
//     if (data.length > 0) {
//       console.log('Packages fetched successfully', data);
//     }
//   }, [data]);

//   // Ratings Button Functionality
//   const handleRatingsClick = async (id: string) => {
//     console.log(`Fetching ratings for package ID: ${id}`);
//     setRatings([
//       { comment: 'Great Package!', stars: 5 }
//     ]);
//     setShowRatingsModal(true);
//   };

//   // Cost Button Functionality
//   const handleCostClick = (id: string) => {
//     console.log(`Fetching cost for package ID: ${id}`);
//     const packageCost = data.find((pkg) => pkg.ID === id)?.Cost || 'N/A';
//     setCost(packageCost);
//     setShowCostModal(true);
//   };

//   if (isLoading) return <p>Loading packages...</p>;
//   if (isError) return <p>Failed to load packages. Please try again later.</p>;

//   return (
//     <div>
//       <Navbar />
//       <div className="directory-page">
//         <h1>Packages Directory</h1>
//         <table className="packages-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Version</th>
//               <th>Name</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((pkg) => (
//               <tr key={pkg.ID}>
//                 <td>{pkg.ID}</td>
//                 <td>{pkg.Version}</td>
//                 <td>{pkg.Name}</td>
//                 <td>
//                   <button onClick={() => handleRatingsClick(pkg.ID)} className="ratings-button">
//                     Ratings
//                   </button>
//                   <button onClick={() => handleCostClick(pkg.ID)} className="cost-button">
//                     Cost
//                   </button>
//                   <button className="update-button">Update</button>
//                   <button className="delete-button">Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modals */}
//       {showRatingsModal && (
//         <RatingsModal ratings={ratings} onClose={() => setShowRatingsModal(false)} />
//       )}
//       {showCostModal && <CostModal cost={cost} onClose={() => setShowCostModal(false)} />}
//     </div>
//   );
// };

// export default DirectoryPage;