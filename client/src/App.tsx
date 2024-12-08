/*
Author(s): Djamel Almabouada, Derek Petersen, Geromy Cunningham
Purpose: Class for React App 
*/

import MainNavbar from "./components/MainNavbar";
import "./App.css";
import Buttons from "./components/Buttons";
import PackageUploader from "./components/PackageUploader";
import PackageDownloader from "./components/PackageDownloader";
import Search from "./components/Search";

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
