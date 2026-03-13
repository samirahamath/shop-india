import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { FiPackage, FiChevronRight, FiTruck, FiCheckCircle } from 'react-icons/fi';

const statusColor = (s) => {
    if (s === 'Delivered') return '#007600';
    if (s === 'Cancelled') return '#cc0c39';
    if (s === 'Shipped' || s === 'Out for Delivery') return '#007185';
    return '#c7a700';
};

const statusBg = (s) => {
    if (s === 'Delivered') return '#f0fff4';
    if (s === 'Cancelled') return '#fff3f3';
    if (s === 'Shipped' || s === 'Out for Delivery') return '#e8f4f8';
    return '#fffbf0';
};

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) { navigate('/login?redirect=myorders'); return; }
        const fetchOrders = async () => {
            try {
                const { data } = await API.get('/orders/myorders');
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user, navigate]);

    if (loading) return <div className="loader" />;

    return (
        <div style={{ background: '#f3f3f3', minHeight: '100vh', padding: '24px 0 40px' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 300, color: '#0f1111' }}>Your Orders</h1>
                    <Link to="/" style={{ color: '#007185', fontSize: 13 }}>Continue Shopping →</Link>
                </div>

                {orders.length === 0 ? (
                    <div style={{ background: '#fff', borderRadius: 4, padding: '60px 20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <FiPackage size={60} style={{ color: '#ddd', marginBottom: 16 }} />
                        <h3 style={{ fontWeight: 300, color: '#565959', marginBottom: 12 }}>You haven't placed any orders yet</h3>
                        <Link to="/" style={{ padding: '10px 28px', background: 'linear-gradient(to bottom, #f7dfa5, #f0c14b)', border: '1px solid #a88734', borderRadius: 4, color: '#111', fontWeight: 500, textDecoration: 'none', fontSize: 14 }}>
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {orders.map((order) => (
                            <div key={order._id} style={styles.orderCard}>
                                {/* Order header */}
                                <div style={styles.orderHead}>
                                    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                                        <div>
                                            <p style={styles.headLabel}>ORDER PLACED</p>
                                            <p style={styles.headVal}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <div>
                                            <p style={styles.headLabel}>TOTAL</p>
                                            <p style={styles.headVal}>₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div>
                                            <p style={styles.headLabel}>SHIP TO</p>
                                            <p style={styles.headVal}>{order.shippingAddress?.fullName}</p>
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                        <p style={{ fontSize: 11, color: '#767676', marginBottom: 2 }}>ORDER # {order._id.slice(-8).toUpperCase()}</p>
                                        <Link to={`/order/${order._id}`} style={{ color: '#007185', fontSize: 13 }}>
                                            View order details <FiChevronRight size={12} />
                                        </Link>
                                    </div>
                                </div>

                                {/* Order body */}
                                <div style={styles.orderBody}>
                                    {/* Status */}
                                    <div style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0', marginBottom: 12 }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                            padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                                            color: statusColor(order.orderStatus), background: statusBg(order.orderStatus),
                                        }}>
                                            {order.orderStatus === 'Delivered' ? <FiCheckCircle size={13} /> : order.orderStatus === 'Shipped' ? <FiTruck size={13} /> : <FiPackage size={13} />}
                                            {order.orderStatus}
                                        </span>
                                        {order.estimatedDelivery && order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                                            <span style={{ fontSize: 12, color: '#565959', marginLeft: 12 }}>
                                                Expected: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </span>
                                        )}
                                        {order.orderStatus === 'Delivered' && order.deliveredAt && (
                                            <span style={{ fontSize: 12, color: '#007600', marginLeft: 12 }}>
                                                Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </span>
                                        )}
                                    </div>

                                    {/* Items */}
                                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', gap: 12, flex: 1, flexWrap: 'wrap' }}>
                                            {order.orderItems.slice(0, 3).map((item, i) => (
                                                <div key={i} style={{ textAlign: 'center' }}>
                                                    <img src={item.image} alt={item.name}
                                                        style={{ width: 72, height: 72, objectFit: 'contain', border: '1px solid #ddd', borderRadius: 4, background: '#fff' }}
                                                        onError={e => { e.target.src = 'https://via.placeholder.com/72?text=Img'; }} />
                                                    <p style={{ fontSize: 11, color: '#565959', maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 4 }}>
                                                        {item.name}
                                                    </p>
                                                </div>
                                            ))}
                                            {order.orderItems.length > 3 && (
                                                <div style={{ width: 72, height: 72, border: '1px solid #ddd', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#007185' }}>
                                                    +{order.orderItems.length - 3} more
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', gap: 10, marginLeft: 'auto', flexWrap: 'wrap', alignItems: 'center' }}>
                                            <Link to={`/order/${order._id}`}
                                                style={{ padding: '7px 16px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, color: '#0f1111', background: '#fff', textDecoration: 'none' }}>
                                                View Details
                                            </Link>
                                            {order.orderStatus === 'Delivered' && (
                                                <Link to={`/product/${order.orderItems[0]?.product}`}
                                                    style={{ padding: '7px 16px', background: 'linear-gradient(to bottom, #f7dfa5, #f0c14b)', border: '1px solid #a88734', borderRadius: 4, fontSize: 13, color: '#111', textDecoration: 'none' }}>
                                                    Buy Again
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    orderCard: { background: '#fff', borderRadius: 4, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
    orderHead: { background: '#f7f7f7', padding: '12px 20px', borderBottom: '1px solid #ddd', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' },
    orderBody: { padding: '16px 20px' },
    headLabel: { fontSize: 11, color: '#565959', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
    headVal: { fontSize: 13, fontWeight: 500, color: '#0f1111' },
};

export default OrderHistory;
