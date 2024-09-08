import React, { useContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';

import { HomeContext } from '../Context/HomeContextProvider';

import ScrollVertical from './ScrollVertical';

const HomeScreen = () => {
  const [cate, setCate] = useState('All');
  const { products, dispatch } = useContext(HomeContext);

  const productData =
    cate === 'All'
      ? products
      : products.filter((data) => data.category === cate);
  const fetchCategory = async () => {
    const response = await fetch('/api/home', {
      method: 'GET',
    });
    const json = await response.json();
    dispatch({ type: 'GETALLPRODUCTS', payload: json.products });
  };
  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className="card-container">
      <ScrollVertical state={setCate} />
      <Row xs={1} sm={2} md={3} lg={4} className="g-1">
        {' '}
        {productData ? (
          productData.map((value, i) => {
            return (
              <Col key={i}>
                <Link
                  style={{ all: 'unset', cursor: 'pointer' }}
                  to={`/product/${value._id}`}
                >
                  <Card className="m-3 g-3">
                    <Card.Img
                      className="home-card"
                      variant="top"
                      src={`/${value.files[0].path}`}
                    />
                    {/* <video autoplay controls>
                      <source
                        src={`/${value.files[0].path}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video> */}

                    <Card.Body>
                      <Card.Title style={{ textAlign: 'center' }}>
                        {value.productId}
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            );
          })
        ) : (
          <div
            style={{
              position: 'fixed',
              left: '48%',
              top: '50%',
            }}
          >
            <Spinner animation="grow" variant="warning"></Spinner>
            <Spinner animation="grow" variant="primary"></Spinner>
            <Spinner animation="grow" variant="dark"></Spinner>
          </div>
        )}
      </Row>
    </div>
  );
};

export default HomeScreen;
