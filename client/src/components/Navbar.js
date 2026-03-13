import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiMapPin } from 'react-icons/fi';
import './Navbar.css';

const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys'];

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [keyword, setKeyword] = useState('');

    const totalQty = cart.cartItems.reduce((acc, item) => acc + item.qty, 0);

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) navigate(`/?search=${keyword}`);
        else navigate('/');
        setIsOpen(false);
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Top announcement bar */}
            <div className="navbar-top-bar">
                🚚 Free delivery on orders above ₹499 | Use code <strong>FIRST10</strong> for 10% off
            </div>

            <nav className="navbar">
                <div className="nav-container container" style={{ maxWidth: '100%', padding: '0 16px' }}>
                    {/* Logo */}
                    <Link to="/" className="nav-logo">
                        Shop<span>Hub</span>
                    </Link>

                    {/* Deliver to */}
                    <div className="hide-mobile" style={{ display: 'flex', flexDirection: 'column', color: '#fff', fontSize: '11px', fontWeight: 300, minWidth: '80px' }}>
                        <span style={{ color: '#ccc', fontSize: '11px' }}>
                            <FiMapPin size={10} style={{ marginRight: 2 }} /> Deliver to
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 500 }}>India</span>
                    </div>

                    {/* Search Bar - Desktop */}
                    <form onSubmit={submitHandler} className="nav-search desktop-search">
                        <input
                            type="text"
                            placeholder="Search products, brands and more..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <button type="submit" aria-label="Search">
                            <FiSearch size={18} />
                        </button>
                    </form>

                    {/* Desktop Menu */}
                    <div className="nav-links desktop-menu">
                        {/* Account */}
                        {user ? (
                            <div className="nav-dropdown">
                                <button className="dropdown-btn">
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 300, color: '#ccc' }}>Hello, {user.name.split(' ')[0]}</span>
                                        <span style={{ fontSize: '13px', fontWeight: 500 }}>Account ▾</span>
                                    </div>
                                </button>
                                <div className="dropdown-content">
                                    <Link to="/myorders"><FiUser size={13} style={{ marginRight: 6 }} />My Orders</Link>
                                    <div className="divider" />
                                    <button onClick={logout} style={{ color: '#cc0c39' }}>Sign Out</button>
                                </div>
                            </div>
                        ) : (
                            <div className="nav-dropdown">
                                <button className="dropdown-btn">
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 300, color: '#ccc' }}>Hello, Guest</span>
                                        <span style={{ fontSize: '13px', fontWeight: 500 }}>Sign In ▾</span>
                                    </div>
                                </button>
                                <div className="dropdown-content">
                                    <Link to="/login">Sign In</Link>
                                    <div className="divider" />
                                    <Link to="/register">Create Account</Link>
                                </div>
                            </div>
                        )}

                        {/* Orders */}
                        <Link to="/myorders" style={{ display: 'flex', flexDirection: 'column', color: '#fff', fontSize: '11px', padding: '4px 8px', borderRadius: 3, border: '2px solid transparent' }}
                            className="nav-orders-btn">
                            <span style={{ fontSize: '11px', color: '#ccc', fontWeight: 300 }}>Returns</span>
                            <span style={{ fontSize: '13px', fontWeight: 500 }}>& Orders</span>
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" className="nav-cart" style={{ alignItems: 'flex-end' }}>
                            <div style={{ position: 'relative' }}>
                                <FiShoppingCart size={26} />
                                {totalQty > 0 && (
                                    <span className="cart-badge" style={{ top: '-8px', left: '12px' }}>{totalQty}</span>
                                )}
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 500 }}>Cart</span>
                        </Link>
                    </div>

                    {/* Mobile: Cart + Hamburger */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="show-mobile">
                        <Link to="/cart" style={{ position: 'relative', color: '#fff', padding: 4 }}>
                            <FiShoppingCart size={22} />
                            {totalQty > 0 && (
                                <span className="cart-badge">{totalQty}</span>
                            )}
                        </Link>
                        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Menu">
                            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="mobile-menu">
                        <div className="mobile-menu-section">
                            <form onSubmit={submitHandler} className="mobile-search">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    style={{ flex: 1, padding: '9px 12px', border: 'none', outline: 'none', fontSize: 14 }}
                                />
                                <button type="submit" style={{ background: '#FF9900', padding: '9px 12px', border: 'none', cursor: 'pointer' }}>
                                    <FiSearch size={16} />
                                </button>
                            </form>
                        </div>

                        {user ? (
                            <>
                                <Link to="/myorders" onClick={toggleMenu}>📦 My Orders</Link>
                                <button onClick={() => { logout(); toggleMenu(); }} className="mobile-logout">🚪 Sign Out</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={toggleMenu}>🔐 Sign In</Link>
                                <Link to="/register" onClick={toggleMenu}>📝 Create Account</Link>
                            </>
                        )}

                        <div className="mobile-menu-section" style={{ padding: '8px 0' }}>
                            <h4 style={{ paddingLeft: 16, paddingBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#FF9900', fontSize: 12, letterSpacing: 1 }}>SHOP BY CATEGORY</h4>
                        </div>
                        {categories.map(cat => (
                            <Link key={cat} to={`/?category=${cat}`} onClick={toggleMenu}>{cat}</Link>
                        ))}
                        <Link to="/about" onClick={toggleMenu}>ℹ️ About Us</Link>
                        <Link to="/contact" onClick={toggleMenu}>📞 Contact</Link>
                    </div>
                )}
            </nav>

            {/* Secondary nav: Categories */}
            <div className="navbar-secondary hide-mobile">
                <div className="container" style={{ maxWidth: '100%', padding: '0 16px' }}>
                    <Link to="/?category=All" className="nav-cat-link" style={{ fontWeight: 500 }}>☰ All</Link>
                    {categories.map(cat => (
                        <Link key={cat} to={`/?category=${cat}`} className="nav-cat-link">{cat}</Link>
                    ))}
                    <Link to="/about" className="nav-cat-link">About</Link>
                    <Link to="/contact" className="nav-cat-link">Contact</Link>
                </div>
            </div>
        </>
    );
};

export default Navbar;
