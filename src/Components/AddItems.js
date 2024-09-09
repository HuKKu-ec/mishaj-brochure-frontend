import React, { useContext, useState } from 'react';
import { Button, Card, Col, Row, Spinner, Modal } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { CategoryContext } from '../Context/CategoryContextProvider';
import { ProductContext } from '../Context/ProductContextProvider';
import { toast } from 'react-toastify';
import { AdminContext } from '../Context/AdminContextProvider';

const AddItems = () => {
  const [proId, setProId] = useState('');
  const [cate, setCate] = useState('');
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cropper, setCropper] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [progress, setProgress] = useState(true);
  const [hight, setHight] = useState('');
  const [width, setWidth] = useState('');
  const [rate, setRate] = useState('');

  const { categorys } = useContext(CategoryContext);
  const { dispatch } = useContext(ProductContext);
  const { admin } = useContext(AdminContext);
  const [imageShow, setImageShow] = useState(false);
  const [AvailRateSizeShow, setAvailRateSizeShow] = useState(false);
  const [AvailRateSize, setAvailRateSize] = useState([]);

  function handleAvailRateSizeClose() {
    setAvailRateSizeShow(false);
  }
  function handleAvailRateSizeCloseAndClear() {
    setAvailRateSize([]);
  }

  const handleAvailRateSizeShow = () => setAvailRateSizeShow(true);

  const handleImageClose = () => setImageShow(false);
  const handleImageShow = () => setImageShow(true);

  const handleClear = () => {
    setProId('');
    setCate('');
    setImages([]);
    setImagePreview(null);
    setCurrentImageIndex(0);
    setAvailRateSize([]);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setProgress(false);

    if (proId && cate && images.length > 0) {
      const formData = new FormData();
      images.forEach((image) => formData.append('files', image));
      formData.append('productId', proId);
      formData.append('category', cate);
      AvailRateSize.forEach((item) => {
        formData.append('available_size_and_rate', JSON.stringify(item));
      });

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        toast.success('Product is added successfully');
        setProgress(true);
        dispatch({ type: 'ADDPRODUCT', payload: json });
        handleClear();
      } else {
        setProgress(true);
        toast.error(json.message);
      }
    } else {
      setProgress(true);
      toast.error('Error: All fields must be filled');
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages(files);
      setImagePreview(URL.createObjectURL(files[0]));
      setCurrentImageIndex(0);
      setImageShow(true);
    }
  };

  const handleCrop = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        const croppedImage = new File(
          [blob],
          `cropped_${currentImageIndex}.jpg`,
          { type: 'image/jpeg' }
        );
        setImages((prevImages) => {
          const newImages = [...prevImages];
          newImages[currentImageIndex] = croppedImage;
          return newImages;
        });
        if (currentImageIndex < images.length - 1) {
          setCurrentImageIndex(currentImageIndex + 1);
          setImagePreview(URL.createObjectURL(images[currentImageIndex + 1]));
        } else {
          setImageShow(false);
        }
      }, 'image/jpeg');
    }
  };
  const handleAddToTable = () => {
    AvailRateSize.push({
      id: Math.floor(Math.random() * 100000000),
      hight: hight,
      width: width,
      rate: rate,
    });
    setAvailRateSize([...AvailRateSize]);
    setHight('');
    setWidth('');
    setRate('');
  };

  return (
    <div className="additems-container">
      <Card className="p-3">
        <h2 style={{ textAlign: 'center' }}>Add Items</h2>
        <FloatingLabel
          controlId="floatingInput"
          label="Product ID"
          className="mb-3"
        >
          <Form.Control
            placeholder="Product ID"
            value={proId}
            type="text"
            onChange={(e) => setProId(e.target.value)}
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingSelect"
          label="Category"
          className="mb-2"
        >
          <Form.Select
            as="select"
            value={cate}
            onChange={(e) => setCate(e.target.value)}
          >
            <option value="">Select Category</option>
            {categorys &&
              categorys.map((value, i) => (
                <option key={i} value={value.category}>
                  {value.category}
                </option>
              ))}
          </Form.Select>
        </FloatingLabel>
        <Button variant="primary mb-3" onClick={handleImageShow}>
          Upload Images
        </Button>
        <Modal show={imageShow} onHide={handleImageClose} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Upload and Crop Images</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload The Images</Form.Label>
              <Form.Control
                className="file-input"
                type="file"
                multiple
                onChange={handleFileChange}
              />
            </Form.Group>
            {imagePreview && (
              <Cropper
                src={imagePreview}
                style={{ hight: 400, width: '100%' }}
                aspectRatio={5 / 6}
                viewMode={1}
                guides={true}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                onInitialized={(instance) => setCropper(instance)}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleImageClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCrop}>
              Crop & Save ({currentImageIndex + 1} / {images.length})
            </Button>
          </Modal.Footer>
        </Modal>
        <Button variant="primary mb-3" onClick={handleAvailRateSizeShow}>
          Available Sizes & Rate
        </Button>
        <Modal
          show={AvailRateSizeShow}
          onHide={handleAvailRateSizeClose}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Available Sizes & Rate</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col lg="3">
                <b>Hight</b>
              </Col>
              <Col lg="3">
                <b>Width</b>
              </Col>
              <Col lg="3">
                <b>Rate</b>
              </Col>
            </Row>
            {AvailRateSize.map((value, ind) => (
              <Row>
                <Col lg="3">{value.hight}</Col>
                <Col lg="3">{value.width}</Col>
                <Col lg="3">{value.rate}</Col>
              </Row>
            ))}
            <Row>
              <Col lg="3">
                <Form.Control
                  placeholder="Heigth"
                  value={hight}
                  type="number"
                  onChange={(e) => setHight(e.target.value)}
                />
              </Col>{' '}
              <Col lg="3">
                <Form.Control
                  placeholder="Width"
                  value={width}
                  type="number"
                  onChange={(e) => setWidth(e.target.value)}
                />
              </Col>
              <Col lg="3">
                <Form.Control
                  placeholder="Rate"
                  value={rate}
                  type="number"
                  onChange={(e) => setRate(e.target.value)}
                />
              </Col>
              <Col lg="3">
                <Button
                  style={{ width: '100%' }}
                  className="full-width"
                  variant="success"
                  onClick={handleAddToTable}
                >
                  Add to Table
                </Button>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleAvailRateSizeCloseAndClear}
            >
              Clear All
            </Button>
            <Button
              variant="primary"
              onClick={() => setAvailRateSizeShow(false)}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        <Row className="justify-content-xs-right mb-4">
          <Col>
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
              variant="success"
              onClick={handleAddItem}
              disabled={!progress}
            >
              {progress ? (
                'Add Item'
              ) : (
                <>
                  <Spinner animation="grow" variant="light" size="sm" />
                  Uploading
                </>
              )}
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AddItems;
