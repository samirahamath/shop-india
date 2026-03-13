import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';

import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Shipping from './pages/Shipping';
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import OrderDetails from './pages/OrderDetails';
import OrderHistory from './pages/OrderHistory';
import About from './pages/About';
import Contact from './pages/Contact';
import Reviews from './pages/Reviews';
import Admin from './pages/Admin';

// Blocks access to /admin for unauthenticated or non-admin users before rendering anything
function RequireAdmin() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login?redirect=/admin" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return <Admin />;
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cart/:id" element={<Cart />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/shipping" element={<Shipping />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/placeorder" element={<PlaceOrder />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/myorders" element={<OrderHistory />} />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/admin" element={<RequireAdmin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
