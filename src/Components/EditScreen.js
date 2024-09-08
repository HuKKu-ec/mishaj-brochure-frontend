import React, { useEffect } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useParams } from 'react-router-dom';

const EditScreen = () => {
  return (
    <div>
      {' '}
      <div className="Edititems-container">
        {/* enter Product ID */}
        <FloatingLabel
          controlId="floatingInput"
          label="Product ID"
          className="mb-3"
        >
          <Form.Control type="text" placeholder="Product ID" />
        </FloatingLabel>
        {/* select Product Catogory */}
        <FloatingLabel
          className="mb-2"
          controlId="floatingSelect"
          label="Category"
        >
          <Form.Select aria-label="Floating label select example">
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Form.Select>
        </FloatingLabel>

        {/* file upload */}
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload The Image</Form.Label>
          <Form.Control type="file" />
        </Form.Group>
      </div>
    </div>
  );
};
export default EditScreen;
