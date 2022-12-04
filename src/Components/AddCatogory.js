import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  FloatingLabel,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap';
import { CategoryContext } from '../Context/CategoryContextProvider';
import { ProductContext } from '../Context/ProductContextProvider';
import { toast } from 'react-toastify';
import { AdminContext } from '../Context/AdminContextProvider';
const AddCatogory = () => {
  const [category, setCategory] = useState('');

  const [progress, setProgress] = useState(true);
  const { dispatch } = useContext(CategoryContext);
  const { dispatch: productDispatch } = useContext(ProductContext);
  const { admin } = useContext(AdminContext);

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await fetch('/api/category', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });
      const json = await response.json();
      dispatch({ type: 'GETALLCATEGORY', payload: json.categorys });
    };
    fetchCategory();
  }, []);

  const handleClear = () => {
    setCategory('');
  };

  const AddCategoryHandle = async () => {
    if (category) {
      setProgress(false);
      const data = { category };
      const response = await fetch('/api/category', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${admin.token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setProgress(true);
        setCategory('');
        dispatch({ type: 'ADDCATEGORY', payload: json.response });

        toast.success(
          `Category ${json.response.category} is added successfully`,
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
        toast.error(`${json.error}`, {
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
      }
    } else {
      toast.error(`Category field is empty it must be filled`, {
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

  const DeleteCategoryHandle = async () => {
    if (category) {
      const data = { category };
      const response = await fetch('/api/category', {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${admin.token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        toast.success(
          `Category ${json.category.category} is deleted successfully`,
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

        dispatch({ type: 'DELETECATEGORY', payload: json.category });
        productDispatch({
          type: 'DELETEPRODUCTSONCATEGORYDELETE',
          payload: json.category,
        });
        setCategory('');
      } else {
        toast.error(`${json.error}`, {
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
    } else {
      toast.error(`Category field is empty it must be filled`, {
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
    <div>
      <Card className="p-3 mt-5">
        <h1 style={{ textAlign: 'center' }}>Add Categorys</h1>
        <FloatingLabel
          controlId="floatingInput"
          label="Add a Catogory Name"
          className="mb-3 mt-2"
        >
          <Form.Control
            type="text"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          />
        </FloatingLabel>
        <Row className="justify-content-xs-right mb-4">
          <Col>
            {progress ? (
              <Button variant="primary" onClick={handleClear}>
                Clear All
              </Button>
            ) : (
              <Button variant="primary" disabled>
                Clear All
              </Button>
            )}
          </Col>
          <Col>
            {progress ? (
              <Button variant="danger" onClick={DeleteCategoryHandle}>
                Delete
              </Button>
            ) : (
              <Button variant="danger" disabled>
                Delete
              </Button>
            )}
          </Col>
          <Col xs="auto">
            {progress ? (
              <Button variant="success" onClick={AddCategoryHandle}>
                Add
              </Button>
            ) : (
              <Button variant="success">
                <Spinner animation="grow" variant="light" size="sm"></Spinner>
                Adding...
              </Button>
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AddCatogory;
