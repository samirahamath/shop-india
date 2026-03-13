import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiRefreshCw, FiMapPin, FiCreditCard, FiPhone } from 'react-icons/fi';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const statusColor = (s) => {
    if (s === 'Delivered') return '#007600';
    if (s === 'Cancelled') return '#cc0c39';
    if (s === 'Shipped' || s === 'Out for Delivery') return '#007185';
    return '#FF9900';
};

const statusIcon = (s) => {
    if (s === 'Delivered') return <FiCheckCircle size={18} />;
    if (s === 'Cancelled') return <FiXCircle size={18} />;
    if (s === 'Shipped') return <FiTruck size={18} />;
    if (s === 'Returned') return <FiRefreshCw size={18} />;
    return <FiPackage size={18} />;
};

const OrderDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await API.get(`/orders/${id}`);
                setOrder(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <div className="loader" />;
    if (!order) return <div className="container" style={{ padding: 40, textAlign: 'center' }}>Order not found</div>;

    const currentStep = STATUS_STEPS.indexOf(order.orderStatus);

    return (
        <div style={{ background: '#f3f3f3', minHeight: '100vh', padding: '24px 0 40px' }}>
            <div className="container">
                {/* Page header */}
                <div style={styles.pageHeader}>
                    <div>
                        <h1 style={styles.h1}>Order Details</h1>
                        <p style={{ fontSize: 13, color: '#565959', marginTop: 4 }}>
                            Order #{order._id.slice(-8).toUpperCase()} &nbsp;|&nbsp;
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <Link to="/myorders" style={styles.backLink}>← Back to Orders</Link>
                </div>

                {/* Status tracker */}
                {order.orderStatus !== 'Cancelled' && (
                    <div style={styles.trackerCard}>
                        <h3 style={styles.subTitle}>Delivery Status</h3>
                        <div style={styles.trackerRow}>
                            {STATUS_STEPS.map((step, i) => (
                                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_STEPS.length - 1 ? 1 : 0 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                                            background: i < currentStep ? '#007600' : i === currentStep ? '#FF9900' : '#ddd',
                                            color: i <= currentStep ? '#fff' : '#999',
                                        }}>
                                            {i < currentStep ? '✓' : i + 1}
                                        </div>
                                        <span style={{ fontSize: 11, color: i <= currentStep ? '#0f1111' : '#999', fontWeight: i === currentStep ? 500 : 300, textAlign: 'center', maxWidth: 70 }}>
                                            {step}
                                        </span>
                                    </div>
                                    {i < STATUS_STEPS.length - 1 && (
                                        <div style={{ flex: 1, height: 2, background: i < currentStep ? '#007600' : '#ddd', margin: '0 4px', marginBottom: 24 }} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {order.estimatedDelivery && order.orderStatus !== 'Delivered' && (
                            <p style={{ fontSize: 13, color: '#007600', marginTop: 12 }}>
                                🗓 Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        )}
                    </div>
                )}

                {/* Cancelled banner */}
                {order.orderStatus === 'Cancelled' && (
                    <div style={{ background: '#fff3f3', border: '1px solid #f5c6cb', borderRadius: 4, padding: '16px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, color: '#721c24' }}>
                        <FiXCircle size={20} /> <strong>This order has been cancelled.</strong>
                    </div>
                )}

                <div className="row" style={{ alignItems: 'flex-start', gap: 16, marginTop: 16 }}>
                    {/* LEFT */}
                    <div style={{ flex: 3, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>

                        {/* Items */}
                        <div style={styles.card}>
                            <h3 style={styles.subTitle}>Items Ordered</h3>
                            {order.orderItems.map((item, i) => (
                                <div key={i} style={styles.orderItem}>
                                    <img src={item.image} alt={item.name} style={styles.itemImg}
                                        onError={e => { e.target.src = 'https://via.placeholder.com/80?text=Img'; }} />
                                    <div style={{ flex: 1 }}>
                                        <Link to={`/product/${item.product}`} style={{ color: '#007185', fontSize: 14, fontWeight: 400 }}>{item.name}</Link>
                                        <p style={{ fontSize: 13, color: '#565959', marginTop: 4 }}>Qty: {item.quantity}</p>
                                    </div>
                                    <span style={{ fontWeight: 500, fontSize: 15 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>

                        {/* Delivery tracking */}
                        {order.deliveryTracking?.length > 0 && (
                            <div style={styles.card}>
                                <h3 style={styles.subTitle}>Tracking Updates</h3>
                                <div style={{ paddingLeft: 16 }}>
                                    {[...order.deliveryTracking].reverse().map((track, i) => (
                                        <div key={i} style={{ position: 'relative', paddingBottom: 20, paddingLeft: 20 }}>
                                            {i < order.deliveryTracking.length - 1 && (
                                                <div style={{ position: 'absolute', left: 6, top: 12, width: 1, height: '100%', background: '#ddd' }} />
                                            )}
                                            <div style={{
                                                position: 'absolute', left: 0, top: 2, width: 13, height: 13, borderRadius: '50%',
                                                background: i === 0 ? '#FF9900' : '#ddd', border: `2px solid ${i === 0 ? '#FF9900' : '#ddd'}`,
                                            }} />
                                            <p style={{ fontSize: 14, fontWeight: i === 0 ? 500 : 300, color: i === 0 ? '#0f1111' : '#565959' }}>{track.status}</p>
                                            <p style={{ fontSize: 12, color: '#767676' }}>{track.description}</p>
                                            {track.location && <p style={{ fontSize: 12, color: '#007185' }}>📍 {track.location}</p>}
                                            <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                                                {new Date(track.timestamp).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT */}
                    <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {/* Order summary */}
                        <div style={styles.card}>
                            <h3 style={styles.subTitle}>Order Summary</h3>
                            {[
                                { l: 'Items', v: `₹${order.itemsPrice?.toLocaleString('en-IN')}` },
                                { l: 'Shipping', v: order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}` },
                                { l: 'GST (18%)', v: `₹${order.taxPrice?.toLocaleString('en-IN')}` },
                            ].map(({ l, v }) => (
                                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, fontWeight: 300 }}>
                                    <span>{l}:</span><span>{v}</span>
                                </div>
                            ))}
                            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '10px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, fontSize: 16 }}>
                                <span>Total:</span><span>₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ marginTop: 12, padding: '8px 12px', background: order.isPaid ? '#f0fff4' : '#fffbf0', borderRadius: 4, fontSize: 13 }}>
                                {order.isPaid ? (
                                    <span style={{ color: '#007600' }}>✅ Paid on {new Date(order.paidAt).toLocaleDateString('en-IN')}</span>
                                ) : (
                                    <span style={{ color: '#c7a700' }}>⏳ Payment Pending</span>
                                )}
                            </div>
                        </div>

                        {/* Shipping address */}
                        <div style={styles.card}>
                            <h3 style={styles.subTitle}><FiMapPin size={13} style={{ marginRight: 4 }} />Delivery Address</h3>
                            <p style={styles.infoText}><strong>{order.shippingAddress.fullName}</strong></p>
                            <p style={styles.infoText}>{order.shippingAddress.address}</p>
                            <p style={styles.infoText}>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
                            <p style={styles.infoText}>{order.shippingAddress.country}</p>
                            <p style={{ ...styles.infoText, color: '#007185' }}><FiPhone size={11} style={{ marginRight: 4 }} />{order.shippingAddress.phone}</p>
                        </div>

                        {/* Payment info */}
                        <div style={styles.card}>
                            <h3 style={styles.subTitle}><FiCreditCard size={12} style={{ marginRight: 4 }} />Payment</h3>
                            <p style={styles.infoText}>Method: <strong>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'stripe' ? 'Card (Stripe)' : 'UPI'}</strong></p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                                <span style={{ ...statusIcon(order.orderStatus) ? {} : {}, color: statusColor(order.orderStatus) }}>
                                    {statusIcon(order.orderStatus)}
                                </span>
                                <span style={{ color: statusColor(order.orderStatus), fontWeight: 500, fontSize: 13 }}>
                                    {order.orderStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 },
    h1: { fontSize: 24, fontWeight: 300, color: '#0f1111' },
    backLink: { color: '#007185', fontSize: 13, textDecoration: 'none' },
    trackerCard: { background: '#fff', borderRadius: 4, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 4 },
    trackerRow: { display: 'flex', alignItems: 'flex-start', marginTop: 16, overflowX: 'auto' },
    card: { background: '#fff', borderRadius: 4, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
    subTitle: { fontSize: 16, fontWeight: 500, marginBottom: 14, color: '#0f1111', paddingBottom: 8, borderBottom: '1px solid #eee' },
    orderItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid #f5f5f5' },
    itemImg: { width: 72, height: 72, objectFit: 'contain', border: '1px solid #ddd', borderRadius: 4, background: '#fff', flexShrink: 0 },
    infoText: { fontSize: 13, fontWeight: 300, lineHeight: 1.8, color: '#0f1111' },
};

export default OrderDetails;
