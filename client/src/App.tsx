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
        <h1>ECE 461 Group 105 Project</h1>
      </header>
      <Buttons />
      <PackageUploader />
      <Search />
      <PackageDownloader />
    </div>
  );
}
  
/*
import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  const fetchMessage = () => {
    axios
      .get("/api/") // Proxy will rewrite this to "/"
      .then((res) => {
        setMessage(res.data.message); // "Express + TypeScript Server"
      })
      .catch((error) => {
        console.error("Error fetching message:", error);
      });
  };

  return (
    <div className="App">
      <button onClick={fetchMessage}>Get Message</button>
      <p>{message}</p>
    </div>
  );
};
*/
export default App;
