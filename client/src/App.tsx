
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from '../components1/HomePage';
import DirectoryPage from '../components1/DirectoryPage';
import './App.css';


const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/directory" element={<DirectoryPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;











// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import LoadPackagesPage from '../components/LoadPackagePage';
// import ResetDatabasePage from '../components/ResetDatabasePage';
// import SearchPackagePage from '../components/SearchPackagePage';
// import UploadPackagePage from '../components/UploadPackagePage';
// import UpdatePackagePage from '../components/UpdatePackagePage';
// import ViewPackageHistoryPage from '../components/ViewPackageHistory';
// import FeaturesPage from '../components/FeaturesPage';
// import './App.css';
// const App = () => {
//   return (
//     <Router>
//       <Navbar />
//       <div className="content">
//       <Routes>
//         <Route path="/load-packages" element={<LoadPackagesPage />} />
//         <Route path="/reset-database" element={<ResetDatabasePage />} />
//         <Route path="/search-package" element={<SearchPackagePage />} />
//         <Route path="/upload-package" element={<UploadPackagePage />} />
//         <Route path="/update-package" element={<UpdatePackagePage />} />
//         <Route path="/view-history" element={<ViewPackageHistoryPage />} />
//         <Route path="/features" element={<FeaturesPage />} />
//       </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;