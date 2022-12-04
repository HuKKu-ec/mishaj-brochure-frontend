import React, { useContext, useState } from 'react';
import { Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { CategoryContext } from '../Context/CategoryContextProvider';
import { ProductContext } from '../Context/ProductContextProvider';
import { toast } from 'react-toastify';
import { AdminContext } from '../Context/AdminContextProvider';
const AddItems = () => {
  const [proId, setProId] = useState('');
  const [cate, setCate] = useState('');
  const [imageUpload, setImageUpload] = useState('');

  const [progress, setProgress] = useState(true);
  const { categorys } = useContext(CategoryContext);
  const { dispatch } = useContext(ProductContext);
  const { admin } = useContext(AdminContext);

  const handleClear = () => {
    setProId('');
    setCate('');
    document.getElementsByClassName('file-input')[0].value = '';
    setImageUpload('');
  };

  const handleAddItem = async (e) => {
    setProgress(false);
    if (proId && cate && imageUpload) {
      e.preventDefault();

      const formdata = new FormData();
      for (let i = 0; i < imageUpload.length; i++) {
        formdata.append('files', imageUpload[i]);
      }
      formdata.append('productId', proId);
      formdata.append('category', cate);

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formdata,
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        toast.success(`Product is added successfully`, {
          draggablePercent: 60,
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        setProgress(true);
        dispatch({ type: 'ADDPRODUCT', payload: json });
        handleClear();
      } else {
        setProgress(true);
        if (json.error.code === 11000) {
          toast.error(
            `The Product with this ID ( ${json.error.keyValue.productId} )
            already exist`,
            {
              draggablePercent: 60,
              position: toast.POSITION.BOTTOM_CENTER,
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            }
          );
        } else {
          setProgress(true);
          toast.error(`${json.message}`, {
            draggablePercent: 60,
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
        }
      }
    } else {
      setProgress(true);
      toast.error(`Error:All fields must be filled`, {
        draggablePercent: 60,
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  return (
    <div className="additems-container">
      <Card className="p-3">
        <h1 style={{ textAlign: 'center' }}>Add Items</h1>
        {/* enter Product ID */}
        <FloatingLabel
          controlId="floatingInput"
          label="Product ID"
          className="mb-3"
        >
          <Form.Control
            value={proId}
            type="text"
            onChange={(e) => {
              setProId(e.target.value);
            }}
          />
        </FloatingLabel>
        {/* select Product Catogory */}
        <FloatingLabel
          className="mb-2"
          controlId="floatingSelect"
          label="Category"
        >
          <Form.Select
            as="select"
            controlled="true"
            value={cate}
            onChange={(e) => {
              setCate(e.target.value);
            }}
            placeholder="Category"
          >
            <option></option>
            {categorys ? (
              categorys.map((value, i) => {
                return (
                  <option key={i} value={`${value.category}`}>
                    {value.category}
                  </option>
                );
              })
            ) : (
              <option></option>
            )}
          </Form.Select>
        </FloatingLabel>

        {/* file upload */}
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload The Image</Form.Label>
          <Form.Control
            className="file-input"
            type="file"
            multiple
            onChange={(e) => {
              setImageUpload(e.target.files);
            }}
          />
        </Form.Group>
        <Row className="justify-content-xs-right mb-4">
          <Col>
            {progress ? (
              <Button variant="primary " onClick={handleClear}>
                Clear All
              </Button>
            ) : (
              <Button variant="primary " disabled>
                Clear All
              </Button>
            )}
          </Col>

          <Col xs="auto">
            {progress ? (
              <Button variant="success" onClick={handleAddItem}>
                Add Item
              </Button>
            ) : (
              <Button variant="success">
                <Spinner animation="grow" variant="light" size="sm"></Spinner>
                Uploading
              </Button>
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AddItems;
