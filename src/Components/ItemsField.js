import React, { useContext, useEffect, useState } from 'react';
import { Col, FloatingLabel, Row, Form, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CategoryContext } from '../Context/CategoryContextProvider';
import { ProductContext } from '../Context/ProductContextProvider';
import { toast } from 'react-toastify';
import { AdminContext } from '../Context/AdminContextProvider';

const ItemsField = () => {
  const [cate, setCate] = useState('All');

  const { categorys } = useContext(CategoryContext);
  const { products, dispatch } = useContext(ProductContext);
  const { admin } = useContext(AdminContext);

  const productData =
    cate === 'All'
      ? products
      : products.filter((data) => data.category === cate);
  useEffect(() => {
    const fetchCategory = async () => {
      const response = await fetch('/api/products', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });
      const json = await response.json();
      dispatch({ type: 'GETALLPRODUCTS', payload: json.products });
    };
    fetchCategory();
  }, []);

  const handleDeleteProduct = async (id) => {
    const data = { id };
    const response = await fetch('/api/products', {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${admin.token}`,
      },
    });
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: 'DELETEPRODUCT', payload: json.product });
      toast.success('Product is deleted successfully', {
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
    } else {
      console.log(json.message);
      toast.error(`${json.error}`, {
        draggablePercent: 60,
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 5000,
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
    <div className="itemsfield-container ">
      <Row>
        <Col>
          <h1>Items List</h1>
        </Col>
        <Col>
          {/* Filter Product Catogory */}
          <FloatingLabel
            className="mb-2"
            controlId="floatingSelect"
            label="Category"
          >
            <Form.Select
              controlled="true"
              as="select"
              onChange={(e) => {
                setCate(e.target.value);
              }}
            >
              <option value="All">All Category</option>
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
        </Col>
      </Row>

      <table className="table table-sm">
        <thead>
          <tr>
            <th scope="col">SI No</th>
            <th scope="col">Product Id</th>
            <th scope="col">Category</th>
            <th scope="col">File Names</th>
            <th scope="col">Image</th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        {productData &&
          productData.map((value, i) => {
            return (
              <tbody key={i}>
                <tr style={{ verticalAlign: 'middle' }}>
                  <th scope="row">{i + 1}</th>
                  <td>{value.productId}</td>
                  <td>{value.category}</td>
                  <td>
                    {value.files.map((v, i) => {
                      return (
                        <span style={{ fontSize: '10px' }} key={i}>
                          {v.filename}
                          <br />
                        </span>
                      );
                    })}
                  </td>
                  <td>
                    <Image
                      src={`/${value.files[0].path}`}
                      style={{ height: '70px', width: '70px' }}
                    />
                    {/* {value.files.map((v, i) => {
                      return (
                        <Image
                          src={`/${v.path}`}
                          style={{ height: '70px', width: '70px' }}
                        />
                      );
                    })} */}
                  </td>
                  <td>
                    <Link to="/edit">
                      <Button variant="primary">Edit</Button>
                    </Link>
                  </td>

                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteProduct(value._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              </tbody>
            );
          })}
      </table>
    </div>
  );
};

export default ItemsField;
