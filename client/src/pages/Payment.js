import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiCreditCard, FiDollarSign, FiSmartphone } from 'react-icons/fi';

const PAYMENT_METHODS = [
    { id: 'stripe', label: 'Credit / Debit Card (Stripe)', icon: <FiCreditCard size={20} />, desc: 'Visa, MasterCard, RuPay' },
    { id: 'cod', label: 'Cash on Delivery', icon: <FiDollarSign size={20} />, desc: 'Pay when your order arrives' },
    { id: 'upi', label: 'UPI / Net Banking', icon: <FiSmartphone size={20} />, desc: 'GPay, PhonePe, NetBanking' },
];

const Payment = () => {
    const { cart, savePaymentMethod } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [method, setMethod] = useState(cart.paymentMethod || 'stripe');

    useEffect(() => {
        if (!user) navigate('/login?redirect=payment');
        if (!cart.shippingAddress?.address) navigate('/shipping');
    }, [user, navigate, cart.shippingAddress]);

    const submitHandler = e => {
        e.preventDefault();
        savePaymentMethod(method);
        navigate('/placeorder');
    };

    return (
        <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh', padding: '24px 16px' }}>
            <div style={{ maxWidth: 520, margin: '0 auto' }}>
                {/* Steps */}
                <div style={styles.steps}>
                    {['Cart', 'Shipping', 'Payment', 'Review'].map((s, i) => (
                        <span key={s} style={{ ...styles.step, ...(i === 2 ? styles.stepActive : i < 2 ? styles.stepDone : {}) }}>
                            {i < 2 ? '✓ ' : `${i + 1}. `}{s}
                        </span>
                    ))}
                </div>

                <div style={styles.card}>
                    <h1 style={styles.title}>Select a payment method</h1>

                    <form onSubmit={submitHandler}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                            {PAYMENT_METHODS.map(pm => (
                                <label
                                    key={pm.id}
                                    style={{
                                        ...styles.methodCard,
                                        ...(method === pm.id ? styles.methodActive : {}),
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={pm.id}
                                        checked={method === pm.id}
                                        onChange={() => setMethod(pm.id)}
                                        style={{ marginRight: 12 }}
                                    />
                                    <span style={{ marginRight: 12, color: method === pm.id ? '#FF9900' : '#565959' }}>{pm.icon}</span>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 500, color: '#0f1111' }}>{pm.label}</p>
                                        <p style={{ fontSize: 12, color: '#565959' }}>{pm.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {method === 'stripe' && (
                            <div style={styles.cardNote}>
                                <FiCreditCard size={16} style={{ marginRight: 8 }} />
                                You'll enter your card details securely on the next page via Stripe.
                            </div>
                        )}

                        {method === 'upi' && (
                            <div style={styles.cardNote}>
                                <FiSmartphone size={16} style={{ marginRight: 8 }} />
                                UPI payment link will be generated after placing the order.
                            </div>
                        )}

                        <button type="submit" style={styles.continueBtn}>
                            Use this payment method ›
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    steps: { display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
    step: { fontSize: 13, color: '#767676', padding: '6px 10px' },
    stepActive: { color: '#FF9900', fontWeight: 500, borderBottom: '2px solid #FF9900' },
    stepDone: { color: '#007600' },
    card: { background: '#fff', borderRadius: 4, padding: '24px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    title: { fontSize: 20, fontWeight: 400, marginBottom: 20, color: '#0f1111' },
    methodCard: {
        display: 'flex', alignItems: 'center', padding: '14px 16px',
        border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer',
        transition: 'border-color 0.15s', background: '#fff',
    },
    methodActive: { borderColor: '#FF9900', background: '#fffbf0' },
    cardNote: { display: 'flex', alignItems: 'center', padding: '10px 14px', background: '#f0f7ff', borderRadius: 4, fontSize: 13, color: '#007185', marginBottom: 16 },
    continueBtn: { width: '100%', padding: '11px', background: 'linear-gradient(to bottom, #f7a600, #e47911)', border: '1px solid #e47911', borderRadius: 4, color: '#111', fontWeight: 500, fontSize: 15, cursor: 'pointer' },
};

export default Payment;
