/*
Author(s): Djamel Almabouada, Derek Petersen
Purpose: Class for React App 
*/

import React from "react";
import MainNavbar from "./MainNavbar";
import "./App.css";
import Buttons from "./Buttons";
import PackageUploader from "./PackageUploader";
import PackageDownloader from "./PackageDownloader";
import Search from "./Search";

function App() {
  return (
    <div className="App">
      <MainNavbar />
      <header>
        <h1>Welcome to ECE 461 Group 5 Project</h1>
      </header>
      <Buttons />
      <PackageUploader />
      <Search />
      <PackageDownloader />
    </div>
  );
}

export default App;

// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
