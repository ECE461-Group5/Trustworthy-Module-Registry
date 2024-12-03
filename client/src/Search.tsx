
import React, { useState } from "react";
import axios from "axios";

//import { searchPackage } from "./api";

//const API_URL = process.env.REACT_APP_API_URL;  // API URL PATH
export const searchPackage = (query: string) => axios.get("${API_URL}/upload", { params: { query } });

const Search: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
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
          <label htmlFor="searchUrl">Search URL:</label>
          <input
            type="text"
            id="searchUrl"
            value={url}
            onChange={handleInputChange}
            placeholder="Enter a URL"
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