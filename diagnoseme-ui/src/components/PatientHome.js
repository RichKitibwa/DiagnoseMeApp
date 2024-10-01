import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const PatientHome = () => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      try{
        const formData = new FormData();
        formData.append('file', selectedFile);

        const token = localStorage.getItem('jwtToken');

        const response = await axios.post('/api/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('File Uploaded:', response.data);
        setUploadSuccess(true);
        setSelectedFile(null);

      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }
  };

  return (
    <Container className='patient-home mt-4'>
      <h1>Welcome</h1>

      <div>
        {uploadSuccess && (
          <div className="alert alert-success">File uploaded successfully</div>
        )}

        <Form.Group controlId="formFileMultiple" className="mb-3">
          <Form.Label>Upload text or image files.</Form.Label>
          <Form.Control type="file" multiple onChange={handleFileSelect} /> <br/>
          <Button variant="primary" onClick={handleFileUpload}>Upload</Button>
        </Form.Group>
      </div>
    </Container>  
  );
};
  
export default PatientHome; 
