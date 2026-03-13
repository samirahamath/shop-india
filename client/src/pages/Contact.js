import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageSquare, FiHelpCircle, FiShoppingBag, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const FAQS = [
    { q: 'How do I track my order?', a: 'Go to "My Orders" in your account and click "View Details" on any order to see real-time tracking updates.' },
    { q: 'What is the return policy?', a: 'We offer a 30-day hassle-free return policy on all products. Simply raise a return request from your order details page.' },
    { q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days. Express delivery (1-2 days) is available in select cities.' },
    { q: 'Are my payment details secure?', a: 'Yes! All payments are processed through Stripe\'s secure infrastructure with 256-bit SSL encryption.' },
    { q: 'Can I cancel my order?', a: 'Orders can be cancelled before they are shipped. Go to My Orders and click "Cancel Order" if the option is available.' },
];

const CONTACT_INFO = [
    { icon: <FiPhone size={22} />, title: 'Phone Support', lines: ['+91 1800-123-4567', 'Mon - Sat: 9 AM - 9 PM', 'Sun: 10 AM - 6 PM'] },
    { icon: <FiMail size={22} />, title: 'Email Us', lines: ['support@shophub.in', 'returns@shophub.in', 'Response within 24 hrs'] },
    { icon: <FiMapPin size={22} />, title: 'Head Office', lines: ['ShopHub Technologies Pvt. Ltd.', '4th Floor, Tech Park, Whitefield', 'Bengaluru, Karnataka - 560066'] },
    { icon: <FiClock size={22} />, title: 'Working Hours', lines: ['Monday - Friday: 9AM - 9PM', 'Saturday: 10AM - 7PM', 'Sunday: Closed (Online 24/7)'] },
];

const TOPICS = [
    { id: 'order', label: 'Order Issue', icon: <FiShoppingBag /> },
    { id: 'delivery', label: 'Delivery', icon: <FiTruck /> },
    { id: 'payment', label: 'Payment', icon: <FiMail /> },
    { id: 'returns', label: 'Returns', icon: <FiHelpCircle /> },
    { id: 'other', label: 'Other', icon: <FiMessageSquare /> },
];

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', topic: 'order', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = e => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields'); return; }
        setSubmitted(true);
        toast.success('Message sent! We\'ll get back to you within 24 hours.');
    };

    return (
        <div style={{ background: '#fff' }}>
            {/* Hero */}
            <div style={styles.hero}>
                <div style={styles.heroOverlay}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: '#FF9900', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>We're here to help</p>
                        <h1 style={{ color: '#fff', fontSize: 38, fontWeight: 200, marginBottom: 14 }}>Contact Us</h1>
                        <p style={{ color: '#ccc', fontWeight: 300, fontSize: 15 }}>Our support team is always ready to assist you.</p>
                    </div>
                </div>
            </div>

            {/* Contact info cards */}
            <div style={{ background: '#131921', padding: '40px 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
                        {CONTACT_INFO.map(({ icon, title, lines }) => (
                            <div key={title} style={styles.infoCard}>
                                <div style={styles.infoIcon}>{icon}</div>
                                <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 500, marginBottom: 10 }}>{title}</h3>
                                {lines.map(l => <p key={l} style={{ color: '#aaa', fontSize: 13, fontWeight: 300, lineHeight: 1.9 }}>{l}</p>)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form + FAQ */}
            <div style={{ padding: '60px 0', background: '#f3f3f3' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'flex-start' }}>

                        {/* Contact Form */}
                        <div style={styles.formCard}>
                            <h2 style={styles.formTitle}>Send Us a Message</h2>
                            <p style={{ fontSize: 13, color: '#565959', marginBottom: 24, lineHeight: 1.6 }}>
                                Fill in the form below and our team will get back to you within 24 hours.
                            </p>

                            {submitted ? (
                                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#f0fff4', border: '2px solid #007600', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 30 }}>
                                        ✅
                                    </div>
                                    <h3 style={{ fontWeight: 400, color: '#007600', marginBottom: 8 }}>Message Sent!</h3>
                                    <p style={{ fontSize: 13, color: '#565959' }}>
                                        Thank you, <strong>{form.name}</strong>! We'll reply to <strong>{form.email}</strong> within 24 hours.
                                    </p>
                                    <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', topic: 'order', message: '' }); }}
                                        style={{ marginTop: 20, padding: '8px 20px', border: '1px solid #ddd', borderRadius: 4, background: '#fff', cursor: 'pointer', fontSize: 13 }}>
                                        Send Another
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    {/* Topic selector */}
                                    <div style={{ marginBottom: 20 }}>
                                        <label style={styles.label}>Topic</label>
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                            {TOPICS.map(t => (
                                                <button type="button" key={t.id} onClick={() => setForm({ ...form, topic: t.id })}
                                                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 20, border: '1px solid', fontSize: 13, cursor: 'pointer', transition: 'all 0.15s', fontWeight: 300, borderColor: form.topic === t.id ? '#FF9900' : '#ddd', background: form.topic === t.id ? '#fffbf0' : '#fff', color: form.topic === t.id ? '#c7a700' : '#565959' }}>
                                                    {t.icon} {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                        <div className="form-group">
                                            <label style={styles.label}>Full Name <span style={{ color: '#cc0c39' }}>*</span></label>
                                            <input type="text" name="name" className="form-control" placeholder="Your full name" value={form.name} onChange={handleChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label style={styles.label}>Email <span style={{ color: '#cc0c39' }}>*</span></label>
                                            <input type="email" name="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label style={styles.label}>Phone (Optional)</label>
                                        <input type="tel" name="phone" className="form-control" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} />
                                    </div>

                                    <div className="form-group">
                                        <label style={styles.label}>Message <span style={{ color: '#cc0c39' }}>*</span></label>
                                        <textarea name="message" className="form-control" placeholder="Describe your issue or query in detail..." value={form.message} onChange={handleChange} required rows={5} style={{ resize: 'vertical', minHeight: 100 }} />
                                    </div>

                                    <button type="submit" style={{ width: '100%', padding: '12px', background: 'linear-gradient(to bottom, #f7a600, #e47911)', border: '1px solid #e47911', borderRadius: 4, color: '#111', fontWeight: 500, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                        <FiSend size={16} /> Send Message
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* FAQ */}
                        <div>
                            <h2 style={{ fontSize: 24, fontWeight: 300, color: '#0f1111', marginBottom: 24 }}>
                                <FiHelpCircle size={20} style={{ marginRight: 8, color: '#FF9900' }} />
                                Frequently Asked Questions
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {FAQS.map((faq, i) => (
                                    <div key={i} style={styles.faqItem}>
                                        <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                                            <span style={{ fontSize: 14, fontWeight: 500, color: '#0f1111' }}>{faq.q}</span>
                                            <span style={{ color: '#FF9900', fontSize: 20, fontWeight: 300, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>+</span>
                                        </button>
                                        {openFaq === i && (
                                            <div style={{ padding: '0 16px 16px', fontSize: 13, fontWeight: 300, color: '#565959', lineHeight: 1.8 }}>
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Live chat card */}
                            <div style={styles.liveChatCard}>
                                <FiMessageSquare size={28} style={{ color: '#FF9900', marginBottom: 12 }} />
                                <h3 style={{ fontWeight: 500, marginBottom: 8, fontSize: 16 }}>Live Chat Support</h3>
                                <p style={{ fontSize: 13, color: '#565959', fontWeight: 300, lineHeight: 1.7, marginBottom: 16 }}>
                                    Chat with our support agents in real-time. Available Mon–Sat, 9AM to 9PM.
                                </p>
                                <button onClick={() => toast.success('Connecting to live chat...')}
                                    style={{ padding: '9px 22px', background: '#131921', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 400 }}>
                                    Start Live Chat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map placeholder */}
            <div style={{ background: '#eee', height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                <FiMapPin size={36} style={{ color: '#131921' }} />
                <p style={{ fontSize: 14, color: '#565959', fontWeight: 300, textAlign: 'center' }}>
                    ShopHub Technologies Pvt. Ltd.<br />4th Floor, Tech Park, Whitefield, Bengaluru - 560066
                </p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                    style={{ padding: '8px 20px', background: '#131921', color: '#fff', borderRadius: 4, fontSize: 13, textDecoration: 'none' }}>
                    Open in Maps
                </a>
            </div>
        </div>
    );
};

const styles = {
    hero: {
        backgroundImage: 'url(https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=1400&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center', minHeight: 300, position: 'relative',
    },
    heroOverlay: {
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(19,25,33,0.9) 50%, rgba(19,25,33,0.7))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    infoCard: { padding: 24, borderLeft: '1px solid rgba(255,255,255,0.1)' },
    infoIcon: { color: '#FF9900', marginBottom: 12 },
    formCard: { background: '#fff', borderRadius: 4, padding: '32px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
    formTitle: { fontSize: 22, fontWeight: 400, color: '#0f1111', marginBottom: 8 },
    label: { display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 5, color: '#0f1111' },
    faqItem: { border: '1px solid #eee', borderRadius: 4, background: '#fff', overflow: 'hidden' },
    liveChatCard: { border: '1px solid #eee', borderRadius: 4, padding: 24, background: '#fff', marginTop: 16, textAlign: 'center' },
};

export default Contact;
