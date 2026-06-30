import { useState } from 'react';
import '../../styles/Products.css';

function Products() {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    category: ''
  });

  // Dummy product data (replace with API call)
  const products = [
    {
      id: 1,
      name: 'Organic Rice',
      category: 'Grains',
      price: 45,
      quantity: '1000 kg',
      location: 'Coimbatore',
      farmer: 'Ravi Kumar',
      image: '/images/products/rice.jpg'
    },
    {
      id: 2,
      name: 'Fresh Tomatoes',
      category: 'Vegetables',
      price: 25,
      quantity: '500 kg',
      location: 'Coimbatore',
      farmer: 'Priya Singh',
      image: '/images/products/tomatoes.jpg'
    },
    // Add more products as needed
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredProducts = products.filter(product => {
    return (
      product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.location === '' || product.location === filters.location) &&
      (filters.category === '' || product.category === filters.category) &&
      (filters.minPrice === '' || product.price >= Number(filters.minPrice)) &&
      (filters.maxPrice === '' || product.price <= Number(filters.maxPrice))
    );
  });

  return (
    <div className="products">
      <section className="products-hero">
        <h1>Agricultural Products</h1>
        <p>Browse and Order Quality Agricultural Products</p>
      </section>

      <div className="products-content">
        <aside className="filters">
          <h2>Filters</h2>
          <div className="filter-group">
            <label htmlFor="search">Search</label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search products..."
            />
          </div>

          <div className="filter-group">
            <label htmlFor="location">Location</label>
            <select
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
            >
              <option value="">All Locations</option>
              <option value="Coimbatore">Coimbatore</option>
              {/* Add more locations */}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Grains">Grains</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              {/* Add more categories */}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range (₹)</label>
            <div className="price-inputs">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min"
              />
              <span>to</span>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max"
              />
            </div>
          </div>
        </aside>

        <main className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = '/assets/logo.jpg'; }}
                />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">₹{product.price}/kg</p>
                <p className="quantity">Available: {product.quantity}</p>
                <p className="location">
                  <i className="fas fa-map-marker-alt"></i> {product.location}
                </p>
                <p className="farmer">
                  <i className="fas fa-user"></i> {product.farmer}
                </p>
                <button className="order-btn">Place Order</button>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export default Products;
