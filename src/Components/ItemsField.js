import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Col,
  FloatingLabel,
  Row,
  Form,
  Image,
  Button,
  Modal,
  ListGroup,
} from 'react-bootstrap';
import { CategoryContext } from '../Context/CategoryContextProvider';
import { ProductContext } from '../Context/ProductContextProvider';
import { AdminContext } from '../Context/AdminContextProvider';
import { toast } from 'react-toastify';
import Cropper from 'react-cropper'; // Ensure Cropper is installed
import 'cropperjs/dist/cropper.css'; // Import Cropper CSS

const ItemsField = () => {
  // State variables for managing product and file data
  const [cateFil, setCateFil] = useState('All');
  const [proId, setProId] = useState('');
  const [cate, setCate] = useState('');
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cropper, setCropper] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [progress, setProgress] = useState(true);
  const [show, setShow] = useState(false);
  const [imageShow, setImageShow] = useState(false);
  const [editItemId, setEditItemId] = useState('');
  const [AvailRateSize, setAvailRateSize] = useState([]);
  const [hight, setHight] = useState('');
  const [width, setWidth] = useState('');
  const [thickness, setThickness] = useState('');
  const [rate, setRate] = useState('');

  // Context for accessing categories, products, and admin details
  const { categorys } = useContext(CategoryContext);
  const { products, dispatch } = useContext(ProductContext);
  const { admin } = useContext(AdminContext);
  const [AvailRateSizeShow, setAvailRateSizeShow] = useState(false);

  // Handle closing the image modal
  const handleImageClose = () => setImageShow(false);
  const handleImageShow = () => setImageShow(true);

  // Reset form data and close modal
  const handleClose = useCallback(() => {
    setEditItemId('');
    setProId('');
    setCate('');
    setImages([]);
    setImagePreview(null);
    setCurrentImageIndex(0);
    setAvailRateSize([]);
    setShow(false);
  }, []);

  // Populate form fields and open modal for editing
  const handleShow = useCallback(
    (id, proId, cate, img, available_size_and_rate) => {
      setEditItemId(id);
      setProId(proId);
      setCate(cate);
      setImages(img);
      setAvailRateSize([...available_size_and_rate]);
      setShow(true);
    },
    []
  );

  // Handle file selection and set preview for cropping
  const handleFileChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        setImages((prevImages) => [...prevImages, ...files]);
        setImagePreview(URL.createObjectURL(files[0]));
        setCurrentImageIndex(images.length); // Point to the new image
        setImageShow(true);
        e.target.value = null; // Reset file input
      }
    },
    [images.length]
  );
  function handleAvailRateSizeClose() {
    setAvailRateSizeShow(false);
  }
  function handleAvailRateSizeCloseAndClear() {
    setAvailRateSize([]);
  }

  const handleAvailRateSizeShow = () => setAvailRateSizeShow(true);
  const handleAddToTable = () => {
    AvailRateSize.push({
      id: Math.floor(Math.random() * 100000000),
      hight: hight,
      width: width,
      thickness: thickness,
      rate: rate,
    });
    setAvailRateSize([...AvailRateSize]);
    setHight('');
    setWidth('');
    setThickness('');
    setRate('');
  };
  var removeByAttr = function (arr, attr, value) {
    var i = arr.length;
    while (i--) {
      if (
        arr[i] &&
        arr[i].hasOwnProperty(attr) &&
        arguments.length > 2 &&
        arr[i][attr] === value
      ) {
        arr.splice(i, 1);
      }
    }
    return arr;
  };

  const handleDeleteToTable = (id) => {
    setAvailRateSize((prevAvailRateSize) => {
      const filteredArray = prevAvailRateSize.filter((item) => item.id !== id);
      return [...filteredArray]; // Spread the new array to ensure state change
    });
  };
  // Handle cropping and saving the cropped image
  const handleCrop = useCallback(() => {
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

        // Close the modal after cropping
        setImageShow(false);

        // Optionally, update the image preview if there's a next image to crop
        if (currentImageIndex < images.length - 1) {
          setCurrentImageIndex(currentImageIndex + 1);
          setImagePreview(URL.createObjectURL(images[currentImageIndex + 1]));
          setImageShow(true); // Re-open the modal for the next image
        }
      }, 'image/jpeg');
    }
  }, [cropper, currentImageIndex, images.length]);

  // Handle form submission for updating product details
  const handleUpdateItem = useCallback(
    async (e) => {
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

        images.map((image, ind) => {
          if (image.filename) {
            formData.append('currentFilenames', image.filename);
          }
        });

        const response = await fetch(`/api/products/${editItemId}`, {
          method: 'PUT',
          body: formData,
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        });

        const json = await response.json();
        if (response.ok) {
          toast.success('Product updated successfully');
          setProgress(true);
          dispatch({ type: 'EDITPRODUCT', payload: json });
          handleClose();
        } else {
          setProgress(true);
          toast.error(json.message);
        }
      } else {
        setProgress(true);
        toast.error('Error: All fields must be filled');
      }
    },
    [
      admin.token,
      cate,
      dispatch,
      editItemId,
      handleClose,
      images,
      proId,
      AvailRateSize,
    ]
  );

  // Filter product data based on selected category
  const productData =
    cateFil === 'All'
      ? products
      : products.filter((data) => data.category === cateFil);

  // Fetch product data on component mount
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
  }, [admin.token, dispatch, AvailRateSize]);

  // Handle product deletion
  const handleDeleteProduct = useCallback(
    async (id) => {
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
        toast.success('Product deleted successfully');
      } else {
        toast.error(json.error);
      }
    },
    [admin.token, dispatch]
  );

  // Remove image by index
  const handleRemoveImage = useCallback((index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="itemsfield-container">
      <Row>
        <Col>
          <h1>Items List</h1>
        </Col>
        <Col>
          {/* Filter Product Category */}
          <FloatingLabel
            className="mb-2"
            controlId="floatingSelect"
            label="Category"
          >
            <Form.Select
              as="select"
              onChange={(e) => setCateFil(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categorys ? (
                categorys.map((value, i) => (
                  <option key={i} value={value.category}>
                    {value.category}
                  </option>
                ))
              ) : (
                <option></option>
              )}
            </Form.Select>
          </FloatingLabel>
        </Col>
      </Row>

      <table className="table table-sm mt-2">
        <thead>
          <tr>
            <th scope="col">SI No</th>
            <th scope="col">Product Id</th>
            <th scope="col">Category</th>
            <th scope="col">Image</th>
            <th scope="col">Size & Rate</th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        {productData &&
          productData.map((value, i) => (
            <tbody key={i}>
              <tr style={{ verticalAlign: 'middle' }}>
                <th scope="row">{productData.length - i}</th>
                <td>{value.productId}</td>
                <td>{value.category}</td>

                <td>
                  <Image
                    src={`/${value.files[0].path}`}
                    style={{ height: '70px', width: '70px' }}
                  />
                  <br></br>
                  {value.files.map((v, i) => (
                    <span style={{ fontSize: '10px' }} key={i}>
                      {v.filename}
                      <br />
                    </span>
                  ))}
                </td>
                <td>
                  <table
                    style={{
                      fontSize: '10px',
                      borderCollapse: 'collapse',
                      width: '100%',
                    }}
                  >
                    <thead>
                      <tr>
                        <th>Height</th>
                        <th>Width</th>
                        <th>Thick</th>
                        <th>Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {value.available_size_and_rate.map((v, i) => (
                        <tr key={i}>
                          <td>{v.hight}</td>
                          <td>{v.width}</td>
                          <td>{v.thickness}</td>
                          <td>{v.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>

                <td>
                  <Button
                    variant="primary"
                    onClick={async () =>
                      await handleShow(
                        value._id,
                        value.productId,
                        value.category,
                        value.files,
                        value.available_size_and_rate
                      )
                    }
                  >
                    Edit
                  </Button>
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
          ))}
      </table>

      {/* Modal for editing product details */}
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateItem}>
            <Form.Group controlId="productId">
              <Form.Label>Product Id</Form.Label>
              <Form.Control
                type="text"
                value={proId}
                onChange={(e) => setProId(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="category">
              <FloatingLabel>Category</FloatingLabel>
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
            </Form.Group>
            <Button
              variant="primary  mt-2"
              style={{ width: '100%' }}
              onClick={handleAvailRateSizeShow}
            >
              Available Sizes & Rate
            </Button>
            <Modal
              show={AvailRateSizeShow}
              onHide={handleAvailRateSizeClose}
              size="lg"
              centered
            >
              <Modal.Header className="bg-light" closeButton>
                <Modal.Title>Available Sizes & Rate</Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-light">
                <Row className="mb-1">
                  <Col>
                    <b>Hight</b>
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
                  <Col></Col>
                </Row>
                {AvailRateSize.map((value, index) => (
                  <Row className="mb-1">
                    <Col>{value.hight}</Col>
                    <Col>{value.width}</Col>
                    <Col>{value.thickness}</Col>
                    <Col>{value.rate}</Col>
                    <Col>
                      <Button
                        style={{ width: '100%' }}
                        className="full-width"
                        variant="danger"
                        onClick={() => handleDeleteToTable(value.id)}
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Row>
                  <Col>
                    <Form.Control
                      placeholder="Heigth"
                      value={hight}
                      type="number"
                      onChange={(e) => setHight(e.target.value)}
                    />
                  </Col>{' '}
                  <Col>
                    <Form.Control
                      placeholder="Width"
                      value={width}
                      type="number"
                      onChange={(e) => setWidth(e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      placeholder="Thickness"
                      value={thickness}
                      type="number"
                      onChange={(e) => setThickness(e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      placeholder="Rate"
                      value={rate}
                      type="number"
                      onChange={(e) => setRate(e.target.value)}
                    />
                  </Col>{' '}
                  <Col>
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
              <Modal.Footer className="bg-light">
                <Button
                  variant="secondary"
                  onClick={handleAvailRateSizeCloseAndClear}
                >
                  Clear All
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setAvailRateSizeShow(false);
                  }}
                >
                  Submit
                </Button>
              </Modal.Footer>
            </Modal>

            <Form.Group controlId="fileUpload">
              <Form.Label>Upload New Images</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Label>Existing Images</Form.Label>
            <ListGroup>
              {images.map((img, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={4}>
                      <Image
                        src={
                          img instanceof File
                            ? URL.createObjectURL(img)
                            : `/${img.path}`
                        }
                        thumbnail
                        style={{ height: '100px', width: '100px' }}
                      />
                    </Col>
                    <Col md={6}>{img.filename}</Col>

                    <Col md={2}>
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveImage(index)}
                      >
                        Remove
                      </Button>
                    </Col>
                    {/* <Col md={2}>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setImagePreview(
                            img instanceof File
                              ? URL.createObjectURL(img)
                              : `/${img.path}`
                          );
                          handleImageShow();
                        }}
                      >
                        Crop
                      </Button>
                    </Col> */}
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Button
              type="submit"
              variant="primary"
              className="mt-3"
              disabled={!progress}
            >
              {progress ? 'Update Product' : 'Updating...'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for image cropping */}
      <Modal show={imageShow} onHide={handleImageClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Crop Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Cropper
            style={{ height: 400, width: '100%' }}
            aspectRatio={1}
            src={imagePreview}
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleImageClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCrop}>
            Crop & Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ItemsField;
