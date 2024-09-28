import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Container } from 'react-bootstrap';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { useParams } from 'react-router-dom';

const ProductDisplay = () => {
  let { id } = useParams();
  const [product, setProduct] = useState({});

  const { files, available_size_and_rate } = product;

  const fetchData = async () => {
    const response = await fetch('/api/home/' + id, {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      setProduct(data.product);
    } else {
      console.error('Failed to fetch product data');
    }
  };

  useEffect(() => {
    fetchData();
  });

  return (
    <Container className="product-card-container">
      <Card className="p-1 shadow-lg rounded">
        <Row>
          <Col lg={4}>
            <Carousel infiniteLoop={true} autoPlay={true} className="rounded">
              {files &&
                files.map((value, i) => (
                  <div key={i}>
                    <img src={`/${value.path}`} alt={`Product ${i + 1}`} />
                  </div>
                ))}
            </Carousel>
          </Col>
          <Col lg={1}></Col>
          <Col lg={7} className="d-flex flex-column justify-content-between">
            <div>
              <div className="p-3 bg-light">
                <h2 className="text-dark">{product.category}</h2>
                <h4 className="text-muted">Product ID: {product.productId}</h4>
              </div>
              <div className="mt-2 bg-light p-3">
                {available_size_and_rate &&
                  available_size_and_rate.length > 0 && (
                    <Row className="text-center p-2">
                      <Col>
                        <b>Height</b>
                      </Col>
                      <Col>
                        <b>Width</b>
                      </Col>
                      <Col>
                        <b>Thickness</b>
                      </Col>
                      <Col>
                        <b>Rate</b>
                      </Col>
                    </Row>
                  )}
                {available_size_and_rate &&
                available_size_and_rate.length > 0 ? (
                  available_size_and_rate.map((value, i) => (
                    <Row key={i} className="text-center mt-2 bg-dark p-2">
                      <Col className="text-light">{value.hight}</Col>
                      <Col className="text-light">{value.width}</Col>
                      <Col className="text-light">{value.thickness}</Col>
                      <Col className="text-light">{value.rate}</Col>
                    </Row>
                  ))
                ) : (
                  <p>No size and rate data available.</p>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default ProductDisplay;
