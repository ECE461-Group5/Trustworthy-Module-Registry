/*
Author(s): Djamel Almabouada, Derek Petersen, Geromy Cunningham
Purpose: Class for React App 
*/

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainNavbar from "./components/MainNavbar";
import Home from "./components/Home";
import Buttons from "./components/Buttons";
import PackageUploader from "./components/PackageUploader";
import Search from "./components/Search";
import PackageDownloader from "./components/PackageDownloader";

function App() {
  return (
    <Router>
      <div className="App">
        <MainNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/upload" element={<PackageUploader />} />
          <Route path="/options" element={<Buttons />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;

