import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Slider from 'react-slick';
import API from '../api';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProduct } = useProduct();
    const { addToCart } = useCart();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);

    // Review form
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const data = await getProduct(id);
            setProduct(data);
            if (data) fetchReviews(id);
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    const fetchReviews = async (productId) => {
        try {
            const { data } = await API.get(`/reviews/product/${productId}`);
            setReviews(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddToCart = () => {
        addToCart(product, qty);
        navigate('/cart');
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        try {
            await API.post('/reviews', { product: id, rating, title, comment });
            toast.success('Review added successfully');
            fetchReviews(id);
            setRating(5); setTitle(''); setComment('');
            // Refresh product data to get updated rating constraint logic
            const data = await getProduct(id);
            setProduct(data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading) return <div className="loader"></div>;
    if (!product) return <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>Product not found</div>;

    const sliderSettings = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1 };

    return (
        <div className="container" style={styles.page}>

            {/* Product Top */}
            <div style={styles.top}>
                {/* Images */}
                <div style={styles.imageColumn}>
                    {product.images.length > 1 ? (
                        <Slider {...sliderSettings}>
                            {product.images.map((img, idx) => (
                                <div key={idx}><img src={img} alt={product.name} style={styles.mainImg} /></div>
                            ))}
                        </Slider>
                    ) : (
                        <img src={product.images[0]} alt={product.name} style={styles.mainImg} />
                    )}
                </div>

                {/* Info Box */}
                <div style={styles.infoColumn}>
                    <p style={styles.brand}>{product.brand}</p>
                    <h1 style={styles.title}>{product.name}</h1>
                    <div style={styles.ratingInfo}>
                        <span style={styles.stars}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
                        <span>{product.rating} ({product.numReviews} ratings)</span>
                    </div>

                    <div style={styles.priceContainer}>
                        <span style={styles.price}>₹{product.price.toLocaleString('en-IN')}</span>
                        {product.originalPrice && (
                            <span style={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
                        )}
                        {product.discount > 0 && <span style={styles.discount}>Save {product.discount}%</span>}
                    </div>

                    <div style={styles.meta}>
                        <p><strong>Status:</strong> {product.stock > 0 ? <span style={{ color: 'green' }}>In Stock ({product.stock})</span> : <span style={{ color: 'red' }}>Out of Stock</span>}</p>
                        <p><strong>Category:</strong> {product.category}</p>
                        <p><strong>Delivery:</strong> {product.deliveryTime}</p>
                        <p><strong>Sold by:</strong> {product.seller}</p>
                    </div>

                    <div style={styles.description}>
                        <strong>Description</strong>
                        <p>{product.description}</p>
                    </div>

                    {/* Action Box (Amazon like cart box) */}
                    <div style={styles.actionBox}>
                        <h3 style={styles.actionPrice}>₹{product.price.toLocaleString('en-IN')}</h3>
                        <p style={styles.deliveryText}>FREE delivery available.</p>

                        {product.stock > 0 ? (
                            <>
                                <div style={styles.qtyContainer}>
                                    <label>Quantity: </label>
                                    <select style={styles.qtySelect} value={qty} onChange={e => setQty(e.target.value)}>
                                        {[...Array(Math.min(product.stock, 10)).keys()].map(x => (
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    style={{ ...styles.btn, ...styles.cartBtn }}
                                    onClick={handleAddToCart}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    style={{ ...styles.btn, ...styles.buyBtn }}
                                    onClick={() => {
                                        addToCart(product, qty);
                                        navigate('/shipping');
                                    }}
                                >
                                    Buy Now
                                </button>
                            </>
                        ) : (
                            <button style={{ ...styles.btn, ...styles.disabledBtn }} disabled>Out of Stock</button>
                        )}

                        <div style={styles.secureTransaction}>
                            <span>🔒 Secure transaction</span>
                        </div>
                    </div>
                </div>
            </div>

            <hr style={styles.hr} />

            {/* Reviews Section */}
            <div style={styles.reviewsSection}>
                <div style={styles.reviewForm}>
                    <h3>Write a customer review</h3>
                    <p>Share your thoughts with other customers</p>
                    {user ? (
                        <form onSubmit={handleReviewSubmit} style={styles.form}>
                            <div className="form-group">
                                <label>Rating</label>
                                <select className="form-control" value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
                                    <option value="">Select...</option>
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="3">3 - Good</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="1">1 - Poor</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Review Title</label>
                                <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Review Comment</label>
                                <textarea className="form-control" rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required></textarea>
                            </div>
                            <button type="submit" className="btn btn-orange" style={{width:'100%',marginTop:8}}>Submit Review</button>
                        </form>
                    ) : (
                        <div style={styles.loginCard}>
                            <p>Please log in to write a review.</p>
                            <button onClick={() => navigate('/login')} className="btn">Sign in</button>
                        </div>
                    )}
                </div>

                <div style={styles.reviewList}>
                    <h3>Top reviews from India</h3>
                    {reviews.length === 0 && <p>No reviews yet. Be the first to review!</p>}
                    {reviews.map(review => (
                        <div key={review._id} style={styles.reviewItem}>
                            <div style={styles.reviewUser}>
                                <div style={styles.avatar}>{review.user?.name.charAt(0)}</div>
                                <span>{review.user?.name}</span>
                            </div>
                            <div style={styles.reviewHeader}>
                                <span style={styles.stars}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                <strong>{review.title}</strong>
                            </div>
                            {review.verified && <span style={styles.verified}>Verified Purchase</span>}
                            <p style={styles.reviewDate}>Reviewed on {new Date(review.createdAt).toLocaleDateString()}</p>
                            <p style={styles.reviewText}>{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

const styles = {
    page: { padding: '24px 10px', background: '#f3f3f3', minHeight: '100vh' },
    top: { display: 'flex', flexDirection: 'row', gap: '24px', flexWrap: 'wrap', background: '#fff', borderRadius: 4, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 16 },
    imageColumn: { flex: '1 1 320px', maxWidth: '420px', alignSelf: 'flex-start', position: 'sticky', top: 80 },
    mainImg: { width: '100%', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px', padding: '20px', background: '#fff' },
    infoColumn: { flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '12px' },
    brand: { color: '#565959', letterSpacing: '1.5px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 300 },
    title: { fontSize: '22px', fontWeight: '400', lineHeight: 1.3, color: '#0f1111' },
    ratingInfo: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#007185', borderBottom: '1px solid #eee', paddingBottom: 12 },
    stars: { color: '#FF9900', fontSize: 16 },
    priceContainer: { display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '12px 0', borderBottom: '1px solid #eee' },
    price: { fontSize: '28px', fontWeight: '600', color: '#0f1111' },
    originalPrice: { textDecoration: 'line-through', color: '#767676', fontSize: '16px' },
    discount: { color: '#cc0c39', fontWeight: '500', fontSize: 15 },
    meta: { fontSize: '14px', lineHeight: '2', fontWeight: 300, color: '#0f1111' },
    description: { fontSize: '14px', color: '#0f1111', fontWeight: 300, lineHeight: 1.8, borderBottom: '1px solid #eee', paddingBottom: '16px' },
    actionBox: { border: '1px solid #ddd', borderRadius: '4px', padding: '20px', width: '100%', maxWidth: '300px', backgroundColor: '#fff', alignSelf: 'flex-start', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
    actionPrice: { fontSize: '22px', fontWeight: '600', marginBottom: '8px', color: '#0f1111' },
    deliveryText: { fontSize: '13px', color: '#007600', marginBottom: '12px', fontWeight: 300 },
    qtyContainer: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' },
    qtySelect: { padding: '6px 10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: 14 },
    btn: { width: '100%', padding: '10px 12px', borderRadius: '4px', fontWeight: '500', cursor: 'pointer', marginBottom: '10px', border: '1px solid transparent', fontSize: 14 },
    cartBtn: { backgroundColor: '#ffd814', borderColor: '#c7a600', color: '#111' },
    buyBtn: { backgroundColor: '#FFA41C', borderColor: '#FF8F00', color: '#111' },
    disabledBtn: { backgroundColor: '#e5e5e5', color: '#888', cursor: 'not-allowed' },
    secureTransaction: { marginTop: '8px', fontSize: '12px', color: '#007185', textAlign: 'center', fontWeight: 300 },
    hr: { margin: '24px 0', border: 'none', borderTop: '1px solid #eee' },
    reviewsSection: { display: 'flex', flexWrap: 'wrap', gap: '32px', background: '#fff', borderRadius: 4, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', alignItems: 'flex-start' },
    reviewForm: { flex: '1 1 280px', minWidth: 0, borderRight: '1px solid #eee', paddingRight: '24px' },
    form: { marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' },
    loginCard: { marginTop: '20px', padding: '20px', border: '1px solid #eee', borderRadius: '4px', textAlign: 'center', background: '#fafafa' },
    reviewList: { display: 'flex', flexDirection: 'column', gap: '24px', flex: '1 1 280px', minWidth: 0 },
    reviewItem: { borderBottom: '1px solid #f0f0f0', paddingBottom: '20px' },
    reviewUser: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
    avatar: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#131921', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '500', fontSize: 14 },
    reviewHeader: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: 4 },
    verified: { fontSize: '12px', color: '#c45500', fontWeight: '500', marginBottom: 4 },
    reviewDate: { fontSize: '12px', color: '#767676', marginBottom: '8px', fontWeight: 300 },
    reviewText: { fontSize: '14px', lineHeight: '1.7', fontWeight: 300, color: '#0f1111' },
};

export default ProductDetails;

