import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiTruck, FiRefreshCw, FiHeadphones, FiUsers, FiAward, FiGlobe, FiStar } from 'react-icons/fi';

const STATS = [
    { icon: <FiUsers size={28} />, val: '2M+', label: 'Happy Customers' },
    { icon: <FiAward size={28} />, val: '50K+', label: 'Products' },
    { icon: <FiGlobe size={28} />, val: '500+', label: 'Cities Served' },
    { icon: <FiStar size={28} />, val: '4.8★', label: 'Avg. Rating' },
];

const TEAM = [
    { name: 'Priya Sharma', role: 'CEO & Co-Founder', img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150' },
    { name: 'Rahul Verma', role: 'CTO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { name: 'Ananya Singh', role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
    { name: 'Karthik Rao', role: 'Head of Marketing', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
];

const VALUES = [
    { icon: <FiShield size={24} />, title: 'Trust & Security', desc: '100% secure payments. All transactions are encrypted and protected by latest security standards.' },
    { icon: <FiTruck size={24} />, title: 'Fast Delivery', desc: 'Free delivery on orders above ₹499. Same-day delivery available in select cities.' },
    { icon: <FiRefreshCw size={24} />, title: 'Easy Returns', desc: '30-day hassle-free return policy on all products. No questions asked.' },
    { icon: <FiHeadphones size={24} />, title: '24/7 Support', desc: 'Round-the-clock customer support via chat, email and phone to help you' },
];

const About = () => {
    return (
        <div style={{ background: '#fff' }}>
            {/* Hero */}
            <div style={styles.hero}>
                <div style={styles.heroOverlay}>
                    <div className="container" style={{ textAlign: 'center' }}>
                        <p style={{ color: '#FF9900', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Our Story</p>
                        <h1 style={{ fontSize: 42, fontWeight: 200, lineHeight: 1.2, marginBottom: 16 }}>
                            India's Most Trusted<br />Online Marketplace
                        </h1>
                        <p style={{ fontSize: 16, fontWeight: 300, maxWidth: 560, margin: '0 auto 28px', opacity: 0.85, lineHeight: 1.8 }}>
                            ShopHub was founded with a simple mission — make premium products accessible to every Indian household at honest prices.
                        </p>
                        <Link to="/" style={{ padding: '12px 32px', background: '#FF9900', borderRadius: 4, color: '#111', fontWeight: 600, textDecoration: 'none', fontSize: 15 }}>
                            Shop Now
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ background: '#131921', padding: '40px 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 24, textAlign: 'center' }}>
                        {STATS.map(({ icon, val, label }) => (
                            <div key={label} style={{ color: '#fff' }}>
                                <div style={{ color: '#FF9900', marginBottom: 10 }}>{icon}</div>
                                <h2 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>{val}</h2>
                                <p style={{ fontSize: 13, color: '#aaa', fontWeight: 300, marginTop: 4 }}>{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission */}
            <div style={{ padding: '70px 0', background: '#f3f3f3' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 50, alignItems: 'center' }}>
                        <div>
                            <p style={{ color: '#FF9900', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Who We Are</p>
                            <h2 style={{ fontSize: 32, fontWeight: 300, lineHeight: 1.3, marginBottom: 20, color: '#0f1111' }}>
                                Empowering Smarter Shopping Decisions
                            </h2>
                            <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.9, color: '#565959', marginBottom: 16 }}>
                                Founded in 2020, ShopHub has grown into one of India's fastest-growing e-commerce platforms. We partner with thousands of sellers to bring you authentic products across every category — from cutting-edge electronics to everyday essentials.
                            </p>
                            <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.9, color: '#565959' }}>
                                Our AI-powered recommendation engine, end-to-end encrypted payments, and lightning-fast logistics network ensure a seamless shopping experience from the moment you browse to the moment your package arrives at your doorstep.
                            </p>
                        </div>
                        <div>
                            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80" alt="About ShopHub"
                                style={{ width: '100%', borderRadius: 8, boxShadow: '0 10px 40px rgba(0,0,0,0.12)', display: 'block' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Values */}
            <div style={{ padding: '70px 0', background: '#fff' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <p style={{ color: '#FF9900', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Our Commitment</p>
                        <h2 style={{ fontSize: 30, fontWeight: 300, color: '#0f1111' }}>Why Millions Choose ShopHub</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 28 }}>
                        {VALUES.map(({ icon, title, desc }) => (
                            <div key={title} style={styles.valueCard}>
                                <div style={styles.valueIcon}>{icon}</div>
                                <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8, color: '#0f1111' }}>{title}</h3>
                                <p style={{ fontSize: 13, fontWeight: 300, color: '#565959', lineHeight: 1.7 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team */}
            <div style={{ padding: '70px 0', background: '#f3f3f3' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <p style={{ color: '#FF9900', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>The People</p>
                        <h2 style={{ fontSize: 30, fontWeight: 300, color: '#0f1111' }}>Leadership Team</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
                        {TEAM.map(({ name, role, img }) => (
                            <div key={name} style={styles.teamCard}>
                                <img src={img} alt={name}
                                    style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', marginBottom: 14, border: '3px solid #FF9900' }} />
                                <h3 style={{ fontSize: 16, fontWeight: 500, margin: 0, color: '#0f1111' }}>{name}</h3>
                                <p style={{ fontSize: 13, color: '#565959', fontWeight: 300, marginTop: 4 }}>{role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div style={{ background: '#131921', padding: '60px 0', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 300, marginBottom: 14 }}>Ready to start shopping?</h2>
                    <p style={{ color: '#aaa', fontSize: 14, fontWeight: 300, marginBottom: 28 }}>Discover millions of products at unbeatable prices.</p>
                    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/" style={{ padding: '12px 32px', background: '#FF9900', borderRadius: 4, color: '#111', fontWeight: 600, textDecoration: 'none' }}>
                            Shop Now
                        </Link>
                        <Link to="/contact" style={{ padding: '12px 32px', border: '1px solid #fff', borderRadius: 4, color: '#fff', fontWeight: 300, textDecoration: 'none' }}>
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    hero: {
        backgroundImage: 'url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center', minHeight: 420,
        position: 'relative',
    },
    heroOverlay: {
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(19,25,33,0.92) 50%, rgba(19,25,33,0.7))',
        display: 'flex', alignItems: 'center', padding: '60px 16px',
    },
    valueCard: {
        background: '#fff', borderRadius: 4, padding: 28,
        border: '1px solid #eee', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    valueIcon: {
        width: 52, height: 52, borderRadius: '50%', background: '#f5f5f5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#FF9900', marginBottom: 16,
    },
    teamCard: {
        background: '#fff', borderRadius: 4, padding: '28px 20px',
        textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        border: '1px solid #eee',
    },
};

export default About;
