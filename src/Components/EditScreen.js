import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const EditScreen = () => {
  return (
    <div>
      {' '}
      <div className="Edititems-container m-5">
        <h1 style={{ textAlign: 'center' }}>Edit Items</h1>
        <Card className="p-3">
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
          <Row className="justify-content-xs-right">
            <Col>
              <Button variant="danger ">Clear All</Button>
            </Col>
            <Col xs="auto">
              <Button variant="success">Edit Item</Button>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default EditScreen;
