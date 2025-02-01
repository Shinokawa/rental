import React, { useState } from 'react';

const FileUpload = ({ onUpload, label, acceptTypes = "*" }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const response = await fetch('http://localhost:8000/api/upload/', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        onUpload(data.fileUrl);
      }
    } catch (error) {
      console.error('上传失败:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label>
        {label}
        <input 
          type="file" 
          onChange={handleUpload}
          accept={acceptTypes}
          disabled={uploading}
        />
      </label>
      {uploading && <span>上传中...</span>}
    </div>
  );
};

export default FileUpload;
