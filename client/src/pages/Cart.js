import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Cart = () => {
    const { cart, addToCart, removeFromCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const { cartItems } = cart;

    const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shipping = subTotal > 499 ? 0 : 40;
    const tax = +(subTotal * 0.18).toFixed(2);
    const total = +(subTotal + shipping + tax).toFixed(2);

    const updateQty = (item, qty) => {
        if (qty < 1) return;
        addToCart({ _id: item.product, name: item.name, images: [item.image], price: item.price, stock: item.stock }, qty);
    };

    const removeHandler = (id) => {
        removeFromCart(id);
        toast.success('Item removed from cart');
    };

    const checkoutHandler = () => {
        if (!user) { navigate('/login?redirect=shipping'); return; }
        navigate('/shipping');
    };

    if (cartItems.length === 0) {
        return (
            <div style={styles.emptyPage}>
                <FiShoppingBag size={80} style={{ color: '#ddd', marginBottom: 20 }} />
                <h2 style={{ fontWeight: 300, color: '#565959' }}>Your ShopHub Cart is empty</h2>
                <p style={{ color: '#767676', margin: '16px 0 24px', fontSize: 14 }}>
                    No items in your cart. Let's go buy something!
                </p>
                <Link to="/" className="btn btn-primary" style={{ padding: '10px 28px', background: 'linear-gradient(to bottom, #f7dfa5, #f0c14b)', border: '1px solid #a88734', borderRadius: 4, color: '#111', fontWeight: 500 }}>
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh', padding: '16px 0 40px' }}>
            <div className="container">
                <div className="row" style={{ alignItems: 'flex-start', gap: 16 }}>
                    {/* LEFT: Cart Items */}
                    <div style={{ flex: 3, minWidth: 0 }}>
                        <div style={styles.card}>
                            <h1 style={styles.cartTitle}>Shopping Cart</h1>
                            <div style={{ textAlign: 'right', fontSize: 12, color: '#565959', marginBottom: 12 }}>Price</div>
                            <hr style={styles.divider} />

                            {cartItems.map((item) => (
                                <div key={item.product} style={styles.cartItem}>
                                    <img src={item.image} alt={item.name} style={styles.itemImg}
                                        onError={e => { e.target.src = 'https://via.placeholder.com/100x100?text=Product'; }} />

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Link to={`/product/${item.product}`} style={styles.itemName}>{item.name}</Link>
                                        <p style={styles.inStock}>In Stock</p>
                                        <p style={{ fontSize: 12, color: '#565959', margin: '4px 0' }}>
                                            <FiLock size={10} style={{ marginRight: 3 }} />
                                            Eligible for FREE Delivery
                                        </p>

                                        <div style={styles.itemActions}>
                                            {/* Qty controls */}
                                            <div style={styles.qtyBox}>
                                                <button style={styles.qtyBtn} onClick={() => updateQty(item, item.qty - 1)} disabled={item.qty <= 1}>
                                                    <FiMinus size={12} />
                                                </button>
                                                <span style={styles.qtyVal}>{item.qty}</span>
                                                <button style={styles.qtyBtn} onClick={() => updateQty(item, item.qty + 1)} disabled={item.qty >= item.stock}>
                                                    <FiPlus size={12} />
                                                </button>
                                            </div>
                                            <span style={styles.vDivider}>|</span>
                                            <button style={styles.actionLink} onClick={() => removeHandler(item.product)}>
                                                <FiTrash2 size={12} style={{ marginRight: 3 }} />Delete
                                            </button>
                                        </div>
                                    </div>

                                    <div style={styles.itemPrice}>
                                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            ))}

                            <hr style={styles.divider} />
                            <p style={{ textAlign: 'right', fontSize: 18, fontWeight: 300 }}>
                                Subtotal ({cartItems.reduce((acc, i) => acc + i.qty, 0)} item{cartItems.length > 1 ? 's' : ''}):{' '}
                                <strong style={{ fontWeight: 500 }}>₹{subTotal.toLocaleString('en-IN')}</strong>
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div style={{ width: 280, flexShrink: 0 }}>
                        <div style={styles.card}>
                            <p style={styles.freeDelivery}>
                                <FiLock size={13} style={{ color: '#007600', marginRight: 4 }} />
                                <span style={{ color: '#007600', fontSize: 13 }}>
                                    {shipping === 0 ? 'Your order qualifies for FREE Delivery.' : `Add ₹${(499 - subTotal).toFixed(0)} more for FREE Delivery.`}
                                </span>
                            </p>

                            <div style={styles.summaryBox}>
                                <div style={styles.summaryRow}>
                                    <span>Items ({cartItems.reduce((acc, i) => acc + i.qty, 0)}):</span>
                                    <span>₹{subTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div style={styles.summaryRow}>
                                    <span>Shipping:</span>
                                    <span style={{ color: shipping === 0 ? '#007600' : '#0f1111' }}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                    </span>
                                </div>
                                <div style={styles.summaryRow}>
                                    <span>Tax (18% GST):</span>
                                    <span>₹{tax.toLocaleString('en-IN')}</span>
                                </div>
                                <hr style={{ ...styles.divider, margin: '12px 0' }} />
                                <div style={{ ...styles.summaryRow, fontWeight: 500, fontSize: 18 }}>
                                    <span>Order Total:</span>
                                    <span>₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button onClick={checkoutHandler}
                                style={{ width: '100%', padding: '10px', fontSize: 14, background: 'linear-gradient(to bottom, #f7a600, #e47911)', border: '1px solid #e47911', borderRadius: 4, color: '#111', fontWeight: 500, cursor: 'pointer', marginTop: 16 }}>
                                Proceed to Buy ({cartItems.reduce((acc, i) => acc + i.qty, 0)} item{cartItems.length > 1 ? 's' : ''})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    emptyPage: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', background: '#fff', minHeight: '60vh' },
    card: { background: '#fff', borderRadius: 4, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
    cartTitle: { fontSize: 28, fontWeight: 300, marginBottom: 8, color: '#0f1111' },
    divider: { border: 'none', borderTop: '1px solid #DDD', margin: '12px 0' },
    cartItem: { display: 'flex', gap: 16, padding: '20px 0', borderBottom: '1px solid #f5f5f5', alignItems: 'flex-start' },
    itemImg: { width: 100, height: 100, objectFit: 'contain', border: '1px solid #ddd', borderRadius: 4, flexShrink: 0, background: '#fff' },
    itemName: { fontSize: 15, fontWeight: 400, color: '#007185', lineHeight: 1.4, display: 'block', marginBottom: 6 },
    inStock: { color: '#007600', fontSize: 12, marginBottom: 4 },
    itemActions: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' },
    qtyBox: { display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 4, overflow: 'hidden' },
    qtyBtn: { background: '#f3f3f3', border: 'none', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    qtyVal: { padding: '4px 10px', fontSize: 14, fontWeight: 500, minWidth: 32, textAlign: 'center' },
    vDivider: { color: '#ddd', fontSize: 18 },
    actionLink: { background: 'none', border: 'none', color: '#007185', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center' },
    itemPrice: { fontSize: 18, fontWeight: 500, color: '#0f1111', whiteSpace: 'nowrap', paddingLeft: 16 },
    freeDelivery: { display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 16, lineHeight: 1.5 },
    summaryBox: { fontSize: 14, fontWeight: 300 },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
};

export default Cart;
