import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/orders`);
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>

      <h2 style={{ marginTop: '30px' }}>Order History</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
            <p><strong>Buyer Name:</strong> {order.buyerDetails?.name || 'N/A'}</p>
            <p><strong>Address:</strong> {order.buyerDetails?.address || 'N/A'}</p>
            <p><strong>Phone:</strong> {order.buyerDetails?.phone || 'N/A'}</p>
            <p><strong>Payment Status:</strong> {order.paymentStatus || 'N/A'}</p>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

            <h4>Products:</h4>
            {order.cartItems.map((item, i) => (
              <div key={i} style={{ marginLeft: '20px', marginBottom: '10px' }}>
                <p><strong>Product Name:</strong> {item._id?.name || 'N/A'}</p>
                <p><strong>Price:</strong> ₹{item._id?.price}</p>
                <p><strong>Quantity Ordered:</strong> {item.quantity}</p>
                {item._id?.image && (
                  <img src={item._id.image} alt={item._id.name} style={{ width: '100px', borderRadius: '8px' }} />
                )}
                <hr />
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;