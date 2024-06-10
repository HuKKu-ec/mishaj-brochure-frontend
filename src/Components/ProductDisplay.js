import React, { useContext, useEffect } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { useParams } from 'react-router-dom';
import { HomeContext } from '../Context/HomeContextProvider';
const ProductDisplay = () => {
  let { id } = useParams();
  const { products } = useContext(HomeContext);
  const product = products.filter((data) => data._id === id);
  const { files } = product[0];
  const fetchData = async () => {
    const response = await fetch('/api/products/' + id, {
      method: 'GET',
    });
    console.log(response);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      className="product-display-container"
      style={{ backgroundColor: '#e4e4e4', padding: '50px' }}
    >
      {' '}
      <Row>
        <Col lg="7">
          <Card className="p-3 mt-5">
            <Carousel>
              {files &&
                files.map((value, i) => {
                  return (
                    <div>
                      <img src={`/${value.path}`} />
                    </div>
                  );
                })}
            </Carousel>
          </Card>
        </Col>
        <Col lg="5">
          <Card className="p-3 mt-5">
            <h1>{product && product[0].category}</h1>
            <h3>PRODUCT ID :{product && product[0].productId}</h3>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDisplay;
