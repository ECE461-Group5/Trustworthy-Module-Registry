/*
Author(s): Djamel Almabouada, Derek Petersen, Geromy Cunningham
Purpose: Class for Uploading/Updating Packages to the API 
*/

import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import "../App.css"; // Styles are in this file.

//import { uploadPackage, updatePackage } from "./api";

//const API_URL = process.env.REACT_APP_API_URL;  // API URL PATH
export const uploadPackage = () => axios.post("${API_URL}/upload");
export const updatePackage = () => axios.put("${API_URL}/upload");


interface PackageData {
  URL?: string;
  Content?: string;
  JSProgram?: string;
}


const PackageUploader: React.FC = () => {
  const [packageData, setPackageData] = useState<PackageData>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("Ready");
  // Loading Aspect
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

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

  // Handle Upload Button Functionality
  const handleUpload = async () => {
    if (isUploading) return; // Prevent re-execution if already loading

    setStatus("Uploading...");
    setIsUploading(true); // Disable buttons

    if (!packageData.URL && !packageData.Content) {
      setErrorMessage("Please provide either a URL or a file.");
      setIsUploading(false); // Stop loading     
      handleWait(setStatus); // Use the wait function
      return;
    }

    try {
      const response = await uploadPackage();
      console.log("Upload Successful:", response.data);
      setStatus("Success");
      setErrorMessage("");
    } catch (error) {
        handleApiError(error);
    } finally {
      setIsUploading(false); // Stop loading
    }
  };

  // Handle Update Button Functionality
  const handleUpdate = async () => {
    if (isUpdating) return; // Prevent re-execution if already loading
      setStatus("Updating...");
      setIsUpdating(true); // Disable buttons

    if (!packageData.URL && !packageData.Content) {
      setErrorMessage("Please provide either a URL or a file.");
      setIsUpdating(false);
      handleWait(setStatus); // Use the wait function
      return;
    }

    try {
      const response = await updatePackage ();
      console.log("Update Successful:", response.data);
      setStatus("Success");
      setErrorMessage("");
    } catch (error) {
        handleApiError(error);
    } finally {
      setIsUpdating(false); // Stop loading
    }
  };

  return (
    <div className="upload-package-page">
      <form onSubmit={(e) => e.preventDefault() /* Prevent form submission */}>
        <div className="form-group">
          <label htmlFor="npmUrl">NPM Package URL:</label>
          <input
            type="text"
            id="npmUrl"
            onChange={handleNpmUrlChange}
            placeholder="Enter npmjs package URL"
            aria-required="true"
            disabled={isUploading || isUpdating} // Lock the text box while uploading/updating
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
            disabled={isUploading || isUpdating} // Lock the text box while uploading/updating
          />
        </div>
        <p aria-live="polite">Status: {status}</p>
        {errorMessage && (
          <p className="error-message" role="alert">
            {errorMessage}
          </p>
        )}
        <button onClick={handleUpload} type="button" disabled={isUploading || isUpdating}>
          {isUploading ? "Uploading..." : "Upload Package"}
        </button>
        <button onClick={handleUpdate} type="button" disabled={isUploading || isUpdating}>
          {isUpdating ? "Updating..." : "Update Package"}
        </button>
      </form>
    </div>
  );
};

export default PackageUploader;
