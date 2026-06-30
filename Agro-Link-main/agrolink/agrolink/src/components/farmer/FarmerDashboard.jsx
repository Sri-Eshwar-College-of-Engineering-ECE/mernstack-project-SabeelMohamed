import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const PRODUCTS_API_BASE_URL = `${API_BASE_URL}/products`;

const FarmerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    type: 'crop',
    price: '',
    quantity: '',
    image: '',
    description: '',
    contactNumber: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const navigate = useNavigate();
  const farmerId = localStorage.getItem('farmerId');

  useEffect(() => {
    if (!farmerId) {
      navigate('/farmer/login');
      return;
    }
    fetchProducts();
  }, [farmerId]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${PRODUCTS_API_BASE_URL}/${farmerId}`);
      setProducts(res.data);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
        setNewProduct((prev) => ({
          ...prev,
          image: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      type: 'crop',
      price: '',
      quantity: '',
      image: '',
      description: '',
      contactNumber: ''
    });
    setPreviewImage(null);
    setEditingProduct(null);
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    const { price, quantity, contactNumber } = newProduct;
    if (price <= 0 || quantity <= 0) {
      setError('Price and Quantity must be greater than 0');
      return false;
    }
    if (!/^\d{10}$/.test(contactNumber)) {
      setError('Contact number must be a valid 10-digit number');
      return false;
    }
    setError('');
    return true;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const productData = {
        ...newProduct,
        farmerId
      };
      await axios.post(PRODUCTS_API_BASE_URL, productData);
      fetchProducts();
      setSuccess('Product added successfully!');
      resetForm();
    } catch (err) {
      setError('Failed to add product');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(`${PRODUCTS_API_BASE_URL}/${editingProduct._id}`, {
        ...newProduct,
        farmerId
      });
      fetchProducts();
      setSuccess('Product updated successfully!');
      resetForm();
    } catch (err) {
      setError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${PRODUCTS_API_BASE_URL}/${productId}`);
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setPreviewImage(product.image);
    setSuccess('');
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('farmerId');
    navigate('/farmer/login');
  };

  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'price') return a.price - b.price;
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      return a.type.localeCompare(b.type);
    });

  return (
    <div className="dashboard-container container py-4">
      <style>{`
        .dashboard-container {
          font-family: 'Arial', sans-serif;
          background-color: #f7f7f7;
        }
        .form-container {
          background: #fff;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .card {
          border-radius: 15px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
        }
        .card-title {
          font-weight: 700;
        }
        .btn {
          border-radius: 8px;
        }
        .alert {
          border-radius: 8px;
        }
        .btn-danger {
          background-color: #e74c3c;
          border: none;
        }
        .btn-danger:hover {
          background-color: #c0392b;
        }
        .btn-success {
          background-color: #27ae60;
          border: none;
        }
        .btn-success:hover {
          background-color: #2ecc71;
        }
        .btn-secondary {
          background-color: #bdc3c7;
          border: none;
        }
        .btn-secondary:hover {
          background-color: #95a5a6;
        }
        .products-list h4 {
          margin-top: 40px;
          color: #2c3e50;
        }
        .form-control,
        .form-select {
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 15px;
        }
        .form-control:focus,
        .form-select:focus {
          border-color: #27ae60;
          box-shadow: 0 0 0 0.25rem rgba(46, 204, 113, 0.25);
        }
        .img-thumbnail {
          max-width: 100%;
          max-height: 150px;
          object-fit: cover;
        }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Farmer Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-container mb-5">
        <h4 className="mb-3">{editingProduct ? 'Edit Product' : 'Add New Product'}</h4>
        <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                placeholder="Product Name"
                required
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                name="type"
                value={newProduct.type}
                onChange={handleInputChange}
                required
              >
                <option value="crop">Crop</option>
                <option value="dairy">Dairy</option>
              </select>
            </div>
            <div className="col-md-6">
              <input
                type="number"
                className="form-control"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                placeholder="Price"
                required
                min="1"
              />
            </div>
            <div className="col-md-6">
              <input
                type="number"
                className="form-control"
                name="quantity"
                value={newProduct.quantity}
                onChange={handleInputChange}
                placeholder="Quantity"
                required
                min="1"
              />
            </div>
            <div className="col-md-6">
              <input
                type="tel"
                className="form-control"
                name="contactNumber"
                value={newProduct.contactNumber}
                onChange={handleInputChange}
                placeholder="Contact Number"
                required
                pattern="[0-9]{10}"
              />
            </div>
            <div className="col-md-6">
              <input
                type="file"
                className="form-control"
                onChange={handleImageChange}
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="img-thumbnail mt-2"
                />
              )}
            </div>
            <div className="col-12">
              <textarea
                className="form-control"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Product Description"
                rows="4"
                required
              />
            </div>
            <div className="col-12 text-end">
              <button type="button" className="btn btn-secondary me-2" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="form-control me-2 w-50"
          placeholder="Search by name or type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select w-25"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="type">Sort by Type</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>

      <div className="products-list">
        <h4>Your Products</h4>
        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card h-100">
                {product.image && (
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{ objectFit: 'cover', height: '200px' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p>Type: {product.type}</p>
                  <p>
                    Price: ₹{product.price} /{' '}
                    {product.type === 'crop' ? 'Kg' : 'Litre'}
                  </p>
                  <p>
                    Available: {product.quantity}{' '}
                    {product.type === 'crop' ? 'Kg' : 'Litre'}
                  </p>
                  <p>Contact: {product.contactNumber}</p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <button className="btn btn-sm btn-primary" onClick={() => handleEditProduct(product)}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(product._id)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="text-muted text-center">No products found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
