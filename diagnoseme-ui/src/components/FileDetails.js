import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FileDetails = () => {
  const { fileId } = useParams();
  const [comments, setComments] = useState('');
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`/api/files/file/${fileId}`, {  
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'arraybuffer',
        });

        const fileBuffer = new Uint8Array(response.data);
        const fileData = new Blob([fileBuffer]);
        const fileContentUrl = URL.createObjectURL(fileData);

        setFileContent(fileContentUrl);
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    };

    fetchFile();
  }, [fileId]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/files/comments', {
        fileId: fileId,
        comments: comments,
      });
      console.log('Comments submitted:', response.data);
    } catch (error) {
      console.error('Error submitting comments:', error);
    }
  };

  return (
    <div>
      <h1>File Details</h1>
      {fileContent && (
        <div>
          <img src={fileContent} alt="File" />
        </div>
      )} <br/>
      <div className="form-group">
        <textarea
          className="form-control"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Write comments..."
        ></textarea>
      </div>
      <br/>
      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit Comments
      </button>
    </div>
  );
};

export default FileDetails;
