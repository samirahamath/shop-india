import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const [wishListed, setWishListed] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        setAdded(true);
        toast.success(`${product.name.slice(0, 30)}... added to cart`);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setWishListed(!wishListed);
        toast.success(wishListed ? 'Removed from wishlist' : 'Added to wishlist');
    };

    const renderStars = (rating) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        return (
            <span style={{ color: '#FF9900', fontSize: 13, letterSpacing: 1 }}>
                {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
            </span>
        );
    };

    return (
        <div style={styles.card}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'none'; }}>

            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {/* Image */}
                <div style={styles.imgWrap}>
                    <img
                        src={product.images?.[0] || 'https://via.placeholder.com/300?text=Product'}
                        alt={product.name}
                        style={styles.img}
                        onError={e => { e.target.src = 'https://via.placeholder.com/300x300?text=ShopHub'; }}
                    />
                    {product.discount > 0 && (
                        <span style={styles.discountBadge}>-{product.discount}%</span>
                    )}
                    {product.isFlashSale && (
                        <span style={styles.saleBadge}>SALE</span>
                    )}
                    {/* Wishlist btn */}
                    <button onClick={handleWishlist} style={styles.wishBtn}>
                        <FiHeart size={16} style={{ fill: wishListed ? '#cc0c39' : 'none', color: wishListed ? '#cc0c39' : '#767676' }} />
                    </button>
                </div>

                {/* Body */}
                <div style={styles.body}>
                    {product.brand && <p style={styles.brand}>{product.brand}</p>}
                    <h3 style={styles.title}>{product.name}</h3>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        {renderStars(product.rating || 0)}
                        <span style={{ fontSize: 12, color: '#007185' }}>({product.numReviews?.toLocaleString('en-IN') || 0})</span>
                    </div>

                    {/* Price */}
                    <div style={styles.priceRow}>
                        <span style={styles.price}>₹{product.price?.toLocaleString('en-IN')}</span>
                        {product.originalPrice && (
                            <span style={styles.oldPrice}>₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                        )}
                        {product.discount > 0 && (
                            <span style={styles.saveBadge}>Save {product.discount}%</span>
                        )}
                    </div>

                    {/* Stock */}
                    {product.stock <= 5 && product.stock > 0 && (
                        <p style={{ fontSize: 12, color: '#cc0c39', margin: '4px 0 0' }}>
                            Only {product.stock} left in stock!
                        </p>
                    )}
                    {product.stock === 0 && (
                        <p style={{ fontSize: 12, color: '#767676', margin: '4px 0 0' }}>Currently unavailable</p>
                    )}

                    {/* Free delivery */}
                    {product.price > 499 && (
                        <p style={{ fontSize: 11, color: '#007600', marginTop: 4, fontWeight: 300 }}>FREE Delivery</p>
                    )}
                </div>
            </Link>

            {/* Add to cart */}
            <div style={{ padding: '0 14px 14px' }}>
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    style={{
                        width: '100%', padding: '8px 0',
                        background: product.stock === 0 ? '#f3f3f3' : added ? '#e47911' : 'linear-gradient(to bottom, #f7a600, #e47911)',
                        border: `1px solid ${product.stock === 0 ? '#ddd' : '#e47911'}`,
                        borderRadius: 4, fontSize: 13, fontWeight: 500,
                        color: product.stock === 0 ? '#767676' : '#111', cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        transition: 'all 0.15s',
                    }}
                >
                    <FiShoppingCart size={14} />
                    {product.stock === 0 ? 'Out of Stock' : added ? 'Added!' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

const styles = {
    card: {
        background: '#fff',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid #ddd',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    imgWrap: {
        position: 'relative',
        paddingTop: '100%',
        background: '#fff',
        overflow: 'hidden',
    },
    img: {
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        objectFit: 'contain', padding: 12,
        transition: 'transform 0.3s',
    },
    discountBadge: {
        position: 'absolute', top: 8, left: 8,
        background: '#cc0c39', color: '#fff',
        fontSize: 11, fontWeight: 700, padding: '3px 7px', borderRadius: 2,
    },
    saleBadge: {
        position: 'absolute', top: 8, right: 34,
        background: '#FF9900', color: '#111',
        fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 2, letterSpacing: 0.5,
    },
    wishBtn: {
        position: 'absolute', top: 8, right: 8,
        background: '#fff', border: '1px solid #ddd', borderRadius: '50%',
        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'border-color 0.15s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    body: {
        padding: '12px 14px 8px', flex: 1,
    },
    brand: {
        fontSize: 11, color: '#565959', textTransform: 'uppercase',
        letterSpacing: 0.8, marginBottom: 4, fontWeight: 400,
    },
    title: {
        fontSize: 13, fontWeight: 400, lineHeight: 1.4,
        color: '#0f1111', marginBottom: 8,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
        height: 36,
    },
    priceRow: {
        display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap',
    },
    price: {
        fontSize: 17, fontWeight: 600, color: '#0f1111',
    },
    oldPrice: {
        fontSize: 12, color: '#767676', textDecoration: 'line-through',
    },
    saveBadge: {
        fontSize: 11, color: '#007600', fontWeight: 500,
    },
};

export default ProductCard;
