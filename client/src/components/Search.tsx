/*
Author(s): Djamel Almabouada, Derek Petersen, Geromy Cunningham
Purpose: Class for Searching Packages from API 
*/

import React, { useState } from "react";
import axios from "axios";

//import { searchPackage } from "./api";

//const API_URL = process.env.REACT_APP_API_URL;  // API URL PATH
export const searchPackage = (query: string) => axios.get("${API_URL}/upload", { params: { query } });

const Search: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<string>("URL"); // Dropdown state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value); // Update dropdown selection
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult(`You searched for: ${url}`);
    setIsSearching(false); // Ensure isSearching is reset after form submission
  };

  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default button behavior

    setIsSearching(true); // Set loading state
    setResult(`You searched for: ${url}`);

    setTimeout(() => {
      setIsSearching(false); // Simulate search delay
    }, 2000);

    try {
      const response = await searchPackage(url);
      console.log("Search Results:", response.data);
      setResult(`Search Results: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error("Search Error:", error);
      setResult("Search Failed");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="search-component">
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="searchType">Search By:</label>
          <select
            id="searchType"
            value={searchType}
            onChange={handleSearchTypeChange}
            disabled={isSearching} // Lock dropdown while searching
          >
            <option value="URL">URL</option>
            <option value="Name">Name</option>
            <option value="ID">ID</option>
            <option value="Keyword">Keyword</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="searchUrl">Search:</label>
          <input
            type="text"
            id="searchUrl"
            value={url}
            onChange={handleInputChange}
            placeholder="Enter a valid URL, name, ID, or keyword"
            aria-required="true"
            disabled={isSearching} // Lock the text box while searching
          />
        </div>
        <button onClick={handleButtonClick} type="button" disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </button>
      </form>
      {result && <p className="search-result">{result}</p>}
    </div>
  );
};

export default Search;
