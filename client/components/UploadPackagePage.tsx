import React, { useState } from 'react';

const UploadPackagePage = () => {
  const [packageName, setPackageName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('name', packageName);
    if (file) {
      formData.append('file', file);
    } else {
      alert('Please select a file to upload.');
      return;
    }

    try {
      await fetch('/api/packages/upload', {
        method: 'POST',
        body: formData,
      });
      alert('Package uploaded successfully!');
    } catch (error) {
      console.error('Error uploading package:', error);
    }
  };

  return (
    <div className="section">
      <h2>Upload Package</h2>
      <input
        type="text"
        placeholder="Enter package name"
        value={packageName}
        onChange={(e) => setPackageName(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
          }
        }}
      />
      <button className="primary-button" onClick={handleUpload}>
        Upload Package
      </button>
    </div>
  );
};

export default UploadPackagePage;
