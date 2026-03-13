import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiMapPin, FiPhone, FiUser, FiHome } from 'react-icons/fi';

const Shipping = () => {
    const { cart, saveShippingAddress } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: cart.shippingAddress?.fullName || (user?.name || ''),
        phone: cart.shippingAddress?.phone || (user?.phone || ''),
        address: cart.shippingAddress?.address || '',
        city: cart.shippingAddress?.city || '',
        state: cart.shippingAddress?.state || '',
        zipCode: cart.shippingAddress?.zipCode || '',
        country: cart.shippingAddress?.country || 'India',
    });

    useEffect(() => {
        if (!user) navigate('/login?redirect=shipping');
    }, [user, navigate]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const submitHandler = e => {
        e.preventDefault();
        saveShippingAddress(form);
        navigate('/payment');
    };

    const indianStates = ['Andhra Pradesh','Delhi','Gujarat','Karnataka','Kerala','Maharashtra','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal','Other'];

    return (
        <div style={{ backgroundColor: '#f3f3f3', minHeight: '100vh', padding: '24px 16px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
                {/* Steps */}
                <div style={styles.steps}>
                    {['Cart', 'Shipping', 'Payment', 'Review'].map((s, i) => (
                        <span key={s} style={{ ...styles.step, ...(i === 1 ? styles.stepActive : i < 1 ? styles.stepDone : {}) }}>
                            {i < 1 && <span style={styles.stepDot}>✓</span>}
                            {i >= 1 && <span style={styles.stepDot}>{i + 1}</span>}
                            {s}
                        </span>
                    ))}
                </div>

                <div style={styles.card}>
                    <h1 style={styles.title}><FiMapPin style={{ marginRight: 8 }} />Shipping Address</h1>

                    <form onSubmit={submitHandler}>
                        {[
                            { name: 'fullName', label: 'Full Name', type: 'text', icon: <FiUser />, ph: 'Enter your full name' },
                            { name: 'phone', label: 'Mobile Number', type: 'tel', icon: <FiPhone />, ph: '10-digit mobile number' },
                            { name: 'address', label: 'Address (House No., Street, Area)', type: 'text', icon: <FiHome />, ph: 'House no. / Street / Area' },
                            { name: 'city', label: 'City', type: 'text', icon: <FiMapPin />, ph: 'City' },
                            { name: 'zipCode', label: 'PIN Code', type: 'text', icon: null, ph: '6-digit PIN code' },
                        ].map(({ name, label, type, icon, ph }) => (
                            <div className="form-group" key={name}>
                                <label style={styles.label}>{label} <span style={{ color: '#cc0c39' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    {icon && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#767676' }}>{icon}</span>}
                                    <input
                                        type={type}
                                        name={name}
                                        className="form-control"
                                        placeholder={ph}
                                        value={form[name]}
                                        onChange={handleChange}
                                        required
                                        style={{ paddingLeft: icon ? 34 : 12 }}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="form-group">
                            <label style={styles.label}>State <span style={{ color: '#cc0c39' }}>*</span></label>
                            <select name="state" className="form-control" value={form.state} onChange={handleChange} required>
                                <option value="">Select State</option>
                                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={styles.label}>Country</label>
                            <input type="text" name="country" className="form-control" value={form.country} onChange={handleChange} readOnly />
                        </div>

                        <button type="submit" style={styles.continueBtn}>
                            Continue to Payment ›
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    steps: { display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
    step: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#767676', padding: '6px 10px' },
    stepActive: { color: '#FF9900', fontWeight: 500, borderBottom: '2px solid #FF9900' },
    stepDone: { color: '#007600' },
    stepDot: { width: 20, height: 20, borderRadius: '50%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 },
    card: { background: '#fff', borderRadius: 4, padding: '24px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    title: { fontSize: 20, fontWeight: 400, marginBottom: 20, color: '#0f1111', display: 'flex', alignItems: 'center' },
    label: { display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 5, color: '#0f1111' },
    continueBtn: { width: '100%', padding: '11px', background: 'linear-gradient(to bottom, #f7a600, #e47911)', border: '1px solid #e47911', borderRadius: 4, color: '#111', fontWeight: 500, fontSize: 15, cursor: 'pointer', marginTop: 8 },
};

export default Shipping;
