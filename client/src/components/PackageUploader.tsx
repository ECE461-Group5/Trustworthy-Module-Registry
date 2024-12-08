
/*
Author(s): Djamel Almabouada, Derek Petersen
Purpose: Class for Uploading/Updating Packages to the API 
*/


import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import "../App.css"; // Import styles

// Define API endpoints
const API_BASE_URL = "http://localhost:3000";

// API functions
export const uploadPackage = (packageData: PackageData) =>
  axios.post(`${API_BASE_URL}/upload`, packageData);

export const updatePackage = (packageData: PackageData) =>
  axios.put(`${API_BASE_URL}/update`, packageData);

interface PackageData {
  URL?: string;
  Content?: string;
  JSProgram?: string;
}

const PackageUploader: React.FC = () => {
  const [packageData, setPackageData] = useState<PackageData>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("Ready");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Handle URL input change
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

  // Handle file upload
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
          console.log("Error processing the file:", error);
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

  // Handle API errors
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

  // Add delay for UX feedback
  const handleWait = (setStatus: React.Dispatch<React.SetStateAction<string>>) => {
    setTimeout(() => {
      setStatus("Ready");
    }, 1000);
  };

  // Handle upload button functionality
  const handleUpload = async () => {
    if (isUploading) return;

    setStatus("Uploading...");
    setIsUploading(true);

    if (!packageData.URL && !packageData.Content) {
      setErrorMessage("Please provide either a URL or a file.");
      setIsUploading(false);
      handleWait(setStatus);
      return;
    }

    try {
      const response = await uploadPackage(packageData);
      console.log("Upload Successful:", response.data);
      setStatus("Success");
      setErrorMessage("");
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle update button functionality
  const handleUpdate = async () => {
    if (isUpdating) return;

    setStatus("Updating...");
    setIsUpdating(true);

    if (!packageData.URL && !packageData.Content) {
      setErrorMessage("Please provide either a URL or a file.");
      setIsUpdating(false);
      handleWait(setStatus);
      return;
    }

    try {
      const response = await updatePackage(packageData);
      console.log("Update Successful:", response.data);
      setStatus("Success");
      setErrorMessage("");
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="upload-package-page">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="npmUrl">NPM Package URL:</label>
          <input
            type="text"
            id="npmUrl"
            onChange={handleNpmUrlChange}
            placeholder="Enter npmjs package URL"
            aria-required="true"
            disabled={isUploading || isUpdating}
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
            disabled={isUploading || isUpdating}
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
