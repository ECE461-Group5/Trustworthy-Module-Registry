/*
Author(s): Djamel Almabouada, Derek Petersen, Geromy Cunningham
Purpose: Class for Downloading Packages from API 
*/

import React, { useState, ChangeEvent } from "react";
import axios from "axios";

import "../App.css"; // Styles are in this file.

//import { downloadPackage } from "./api";

const API_URL = "/api/package"; // API URL PATH
export const downloadPackage = (content: string) => axios.get(`${API_URL}/${content}`);

interface PackageData {
  Content?: string;
  URL?: string;
  debloat?: boolean;
  JSProgram?: string;
}


const PackageDownloader: React.FC = () => {
  const [packageData, setPackageData] = useState<PackageData>({});
  const [selectedOption, setSelectedOption] = useState<string>("ID"); // Dropdown state
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("Ready");
  // Loading Aspect
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  //const [downloadedData, setDownloadedData] = useState<unknown>(null); // State for API data


  const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value); // Update dropdown value
  };

  const handleNpmUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPackageData({
      ...packageData,
      Content: undefined,
      URL: e.target.value,
      JSProgram:
        "if (process.argv.length === 7) {\nconsole.log('Success')\nprocess.exit(0)\n} else {\nconsole.log('Failed')\nprocess.exit(1)\n}\n",
    });
    setErrorMessage("");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const file = e.target.files[0];
      const fileReader = new FileReader();

      fileReader.onload = async (event: ProgressEvent<FileReader>) => {
        try {
          if (event.target?.result && typeof event.target.result === "string") {
            const base64String = event.target.result.split(",")[1];
            setPackageData({
              ...packageData,
              URL: undefined,
              Content: base64String,
              JSProgram:
                "if (process.argv.length === 7) {\nconsole.log('Success')\nprocess.exit(0)\n} else {\nconsole.log('Failed')\nprocess.exit(1)\n}\n",
            });
          }
          setErrorMessage("");
        } catch (error) {
          console.log("Error while processing the file:", error);
          setErrorMessage("Error processing the file.");
        }
      };

      fileReader.onerror = () => {
        setErrorMessage("Error reading the file.");
      };

      if (file) {
        fileReader.readAsDataURL(file);
      }
    }
  };

  // Handle API Error messaging 
  const handleApiError = (error: unknown) => {
    setStatus("Failed");
    if (axios.isAxiosError(error)) {
      setErrorMessage(error.message);
      console.error("API Error:", error.message);
    } else {
      setErrorMessage("An unexpected error occurred.");
      console.error("Unexpected Error:", error);
    }
  };

  // Handle Wait Logic
  const handleWait = (setStatus: React.Dispatch<React.SetStateAction<string>>) => {
    setStatus("Failed");
    setTimeout(() => {
        setStatus("Ready");
    }, 1000); // 1 second before setting to 'Failed'
  };

  // Handle Download Button Functionality
  const handleDownload = async () => {
    if (isDownloading) return; // Prevent re-execution if already loading
      setStatus("Downloading...");
      setIsDownloading(true); // Disable buttons

    if (!packageData.URL && !packageData.Content) {
      setErrorMessage("Please provide either a URL or a file.");
      setIsDownloading(false); // Stop loading     
      handleWait(setStatus); // Use the wait function
      return;
    }

    if (!packageData.Content) {
      setErrorMessage("Please enter package Content (ID).");
      return;
    }

    try {
      const response = await downloadPackage(packageData.Content);
      console.log("Downloaded Data:", response.data);
      //setDownloadedData(response.data); // Store the data in state
      setStatus("Success");
      setErrorMessage("");
    } catch (error) {
        handleApiError(error);
    } finally {
      setIsDownloading(false); // Stop loading
    }
  };

  return (
    <div className="upload-package-page">
      <form onSubmit={(e) => e.preventDefault() /* Prevent form submission */}>

      <div className="form-group">
          <label htmlFor="searchType">Search By:</label>
          <select
            id="searchType"
            value={selectedOption}
            onChange={handleDropdownChange}
            disabled={isDownloading}
          >
            <option value="ID">ID</option>
            <option value="Name">Name</option>
            <option value="RegEx">RegEx</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="npmUrl">NPM Package :</label>
          <input
            type="text"
            id="npmUrl"
            onChange={handleNpmUrlChange}
            placeholder="Enter npmjs package URL"
            aria-required="true"
            disabled={isDownloading} // Lock the text box while uploading/updating
          />
        </div>

        <div className="form-group">
          <label htmlFor="packageFile">Package File (zip):</label>
          <input
            type="file"
            id="packageFile"
            onChange={handleFileChange}
            accept=".zip"
            aria-required="true"
            disabled={isDownloading} // Lock the text box while Downloading
          />
        </div>

        <p aria-live="polite">Status: {status}</p>
        {errorMessage && (
          <p className="error-message" role="alert">
            {errorMessage}
          </p>
        )}
        <button onClick={handleDownload} type="button" disabled={isDownloading}>
          {isDownloading ? "Downloading..." : "Download Package"}
        </button>
      </form>

    </div>
  );
};

export default PackageDownloader;
