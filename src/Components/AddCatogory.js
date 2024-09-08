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

const AddCategory = () => {
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
  }, [dispatch, admin.token]);

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
      <Card className="p-3 mt-2">
        <h2 style={{ textAlign: 'center' }}>Add Categories</h2>
        <FloatingLabel
          controlId="floatingInput"
          label="Add a Category Name"
          className="mb-3 mt-2"
        >
          <Form.Control
            placeholder="Add a Category Name"
            type="text"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          />
        </FloatingLabel>

        <Row className="mb-4 align-items-center justify-content-center gap-3">
          <Col xs="auto">
            <Button
              variant="secondary"
              onClick={handleClear}
              disabled={!progress}
            >
              Clear All
            </Button>
          </Col>
          <Col xs="auto">
            <Button
              variant="danger"
              onClick={DeleteCategoryHandle}
              disabled={!progress}
            >
              Delete
            </Button>
          </Col>
          <Col xs="auto">
            <Button
              variant="success"
              onClick={AddCategoryHandle}
              disabled={!progress}
            >
              {progress ? (
                'Add'
              ) : (
                <Spinner animation="grow" variant="light" size="sm" />
              )}
              {!progress && ' Adding...'}
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AddCategory;
