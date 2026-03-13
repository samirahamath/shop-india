import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import API from '../api';
import toast from 'react-hot-toast';
import { FiEdit2, FiMapPin, FiCreditCard, FiPackage } from 'react-icons/fi';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

// ── Stripe payment form ──────────────────────────────────────────────
const StripeForm = ({ clientSecret, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [paying, setPaying] = useState(false);

    const handlePay = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setPaying(true);
        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: elements.getElement(CardElement) },
            });
            if (error) { toast.error(error.message); setPaying(false); return; }
            if (paymentIntent.status === 'succeeded') onSuccess(paymentIntent);
        } catch (err) {
            toast.error('Payment failed'); setPaying(false);
        }
    };

    return (
        <div style={{ marginTop: 16 }}>
            <div style={{ padding: '14px', border: '1px solid #ddd', borderRadius: 4, background: '#fafafa', marginBottom: 12 }}>
                <CardElement options={{ style: { base: { fontSize: '15px', color: '#0f1111', fontWeight: '300' } } }} />
            </div>
            <button onClick={handlePay} disabled={paying || !stripe}
                style={{ width: '100%', padding: '12px', background: 'linear-gradient(to bottom, #f7a600, #e47911)', border: '1px solid #e47911', borderRadius: 4, color: '#111', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>
                {paying ? 'Processing...' : `Pay ₹${''}`}
            </button>
        </div>
    );
};

// ── Main PlaceOrder Component ─────────────────────────────────────────
const PlaceOrder = () => {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const { cartItems, shippingAddress, paymentMethod } = cart;
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [showStripe, setShowStripe] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const itemsPrice = cartItems.reduce((acc, i) => acc + i.price * i.qty, 0);
    const shippingPrice = itemsPrice > 499 ? 0 : 40;
    const taxPrice = +(itemsPrice * 0.18).toFixed(2);
    const totalPrice = +(itemsPrice + shippingPrice + taxPrice).toFixed(2);

    useEffect(() => {
        if (!user) { navigate('/login?redirect=placeorder'); return; }
        if (cartItems.length === 0) navigate('/cart');
        if (!shippingAddress?.address) navigate('/shipping');
    }, [user, navigate, cartItems, shippingAddress]);

    const createOrder = async () => {
        setLoading(true);
        try {
            const { data } = await API.post('/orders', {
                orderItems: cartItems.map(i => ({
                    product: i.product, name: i.name, image: i.image, price: i.price, quantity: i.qty,
                })),
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            });
            return data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create order');
            setLoading(false);
            return null;
        }
    };

    const handlePlaceOrder = async () => {
        const order = await createOrder();
        if (!order) return;

        if (paymentMethod === 'cod') {
            clearCart();
            toast.success('Order placed! Cash on Delivery confirmed.');
            navigate(`/order/${order._id}`);
            setLoading(false);
        } else if (paymentMethod === 'stripe') {
            // Get Stripe client secret
            try {
                const { data } = await API.post('/payment/create-intent', { amount: totalPrice });
                setClientSecret(data.clientSecret);
                setOrderId(order._id);
                setShowStripe(true);
                setLoading(false);
            } catch (err) {
                toast.error('Payment setup failed');
                setLoading(false);
            }
        } else {
            // UPI
            clearCart();
            toast.success('Order placed! UPI payment link sent to your email.');
            navigate(`/order/${order._id}`);
            setLoading(false);
        }
    };

    const handleStripeSuccess = async (paymentIntent) => {
        try {
            await API.put(`/orders/${orderId}/pay`, {
                id: paymentIntent.id, status: paymentIntent.status,
                updateTime: new Date().toISOString(), emailAddress: user.email,
            });
            clearCart();
            toast.success('Payment successful! Order confirmed.');
            navigate(`/order/${orderId}`);
        } catch (err) {
            toast.error('Order update failed. Contact support.');
        }
    };

    if (!shippingAddress) return null;

    return (
        <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh', padding: '24px 16px 40px' }}>
            <div className="container">
                {/* Steps */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                    {['Cart', 'Shipping', 'Payment', 'Review'].map((s, i) => (
                        <span key={s} style={{ fontSize: 13, padding: '6px 10px', ...(i === 3 ? { color: '#FF9900', fontWeight: 500, borderBottom: '2px solid #FF9900' } : i < 3 ? { color: '#007600' } : { color: '#767676' }) }}>
                            {i < 3 ? '✓ ' : '4. '}{s}
                        </span>
                    ))}
                </div>

                <div className="row" style={{ alignItems: 'flex-start', gap: 16 }}>
                    {/* LEFT column */}
                    <div style={{ flex: 3, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>

                        {/* Shipping */}
                        <div style={styles.section}>
                            <div style={styles.sectionHeader}>
                                <FiMapPin /> <span>Delivery Address</span>
                                <Link to="/shipping" style={styles.editLink}><FiEdit2 size={12} /> Change</Link>
                            </div>
                            <div style={styles.sectionBody}>
                                <strong>{shippingAddress.fullName}</strong>
                                <p>{shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zipCode}</p>
                                <p>{shippingAddress.country}</p>
                                <p style={{ color: '#565959' }}>📞 {shippingAddress.phone}</p>
                            </div>
                        </div>

                        {/* Payment */}
                        <div style={styles.section}>
                            <div style={styles.sectionHeader}>
                                <FiCreditCard /> <span>Payment Method</span>
                                <Link to="/payment" style={styles.editLink}><FiEdit2 size={12} /> Change</Link>
                            </div>
                            <div style={styles.sectionBody}>
                                <span style={styles.methodPill}>
                                    {paymentMethod === 'stripe' ? '💳 Card (Stripe)' : paymentMethod === 'cod' ? '💵 Cash on Delivery' : '📱 UPI / NetBanking'}
                                </span>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div style={styles.section}>
                            <div style={styles.sectionHeader}>
                                <FiPackage /> <span>Order Items ({cartItems.length})</span>
                                <Link to="/cart" style={styles.editLink}><FiEdit2 size={12} /> Edit Cart</Link>
                            </div>
                            <div style={styles.sectionBody}>
                                {cartItems.map(item => (
                                    <div key={item.product} style={styles.orderItem}>
                                        <img src={item.image} alt={item.name} style={styles.itemImg}
                                            onError={e => { e.target.src = 'https://via.placeholder.com/60?text=Product'; }} />
                                        <div style={{ flex: 1 }}>
                                            <Link to={`/product/${item.product}`} style={{ color: '#007185', fontSize: 14 }}>{item.name}</Link>
                                            <p style={{ fontSize: 13, color: '#565959' }}>Qty: {item.qty}</p>
                                        </div>
                                        <span style={{ fontWeight: 500 }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stripe form */}
                        {showStripe && clientSecret && (
                            <div style={styles.section}>
                                <div style={styles.sectionHeader}><FiCreditCard /> <span>Enter Card Details</span></div>
                                <div style={styles.sectionBody}>
                                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                                        <StripeForm clientSecret={clientSecret} onSuccess={handleStripeSuccess} />
                                    </Elements>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Summary */}
                    <div style={{ width: 280, flexShrink: 0 }}>
                        <div style={{ background: '#fff', borderRadius: 4, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontWeight: 400, fontSize: 18, marginBottom: 16 }}>Order Summary</h3>
                            {[
                                { label: `Items (${cartItems.reduce((a, i) => a + i.qty, 0)})`, val: `₹${itemsPrice.toLocaleString('en-IN')}` },
                                { label: 'Shipping', val: shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}` },
                                { label: 'GST (18%)', val: `₹${taxPrice.toLocaleString('en-IN')}` },
                            ].map(({ label, val }) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, fontWeight: 300 }}>
                                    <span>{label}:</span>
                                    <span style={{ color: val === 'FREE' ? '#007600' : 'inherit' }}>{val}</span>
                                </div>
                            ))}
                            <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '12px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, fontSize: 18, marginBottom: 20 }}>
                                <span>Order Total:</span>
                                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                            </div>

                            {!showStripe && (
                                <button onClick={handlePlaceOrder} disabled={loading}
                                    style={{ width: '100%', padding: '12px', background: 'linear-gradient(to bottom, #f7a600, #e47911)', border: '1px solid #e47911', borderRadius: 4, color: '#111', fontWeight: 500, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                                    {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : 'Place Order & Pay'}
                                </button>
                            )}

                            <p style={{ fontSize: 11, color: '#767676', marginTop: 12, lineHeight: 1.6 }}>
                                By placing your order, you agree to ShopHub's privacy notice and conditions of use.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    section: { background: '#fff', borderRadius: 4, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
    sectionHeader: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: 500, fontSize: 15, background: '#fafafa' },
    sectionBody: { padding: 20, fontSize: 14, fontWeight: 300, lineHeight: 1.8 },
    editLink: { marginLeft: 'auto', color: '#007185', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' },
    methodPill: { display: 'inline-block', padding: '6px 14px', background: '#f3f3f3', borderRadius: 20, fontSize: 14 },
    orderItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f5f5f5' },
    itemImg: { width: 56, height: 56, objectFit: 'contain', border: '1px solid #ddd', borderRadius: 3, background: '#fff' },
};

export default PlaceOrder;
