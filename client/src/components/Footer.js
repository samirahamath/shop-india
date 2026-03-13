import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiGift, FiRefreshCw, FiTruck, FiShield, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const FOOTER_LINKS = [
    {
        heading: 'Get to Know Us',
        links: [
            { label: 'About Us', to: '/about' },
            { label: 'Careers', to: '#' },
            { label: 'Press Releases', to: '#' },
            { label: 'ShopHub Cares', to: '#' },
        ],
    },
    {
        heading: 'Connect with Us',
        links: [
            { label: 'Facebook', to: '#', icon: <FiFacebook size={13} /> },
            { label: 'Twitter', to: '#', icon: <FiTwitter size={13} /> },
            { label: 'Instagram', to: '#', icon: <FiInstagram size={13} /> },
            { label: 'YouTube', to: '#', icon: <FiYoutube size={13} /> },
        ],
    },
    {
        heading: 'Make Money with Us',
        links: [
            { label: 'Sell on ShopHub', to: '#' },
            { label: 'Become an Affiliate', to: '#' },
            { label: 'Advertise Your Products', to: '#' },
            { label: 'ShopHub Pay on Merchants', to: '#' },
        ],
    },
    {
        heading: 'Let Us Help You',
        links: [
            { label: 'COVID-19 & Shopping', to: '#' },
            { label: 'Your Account', to: '/myorders' },
            { label: 'Returns Centre', to: '#' },
            { label: 'Help', to: '/contact' },
        ],
    },
];

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = () => {
        if (!email || !email.includes('@')) { toast.error('Enter a valid email'); return; }
        toast.success('Subscribed successfully! 🎉');
        setEmail('');
    };

    return (
        <footer>
            {/* Back to top */}
            <div
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{ background: '#37475A', color: '#fff', textAlign: 'center', padding: '14px', fontSize: 13, cursor: 'pointer', fontWeight: 300, letterSpacing: 0.5, transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#4a5e74'}
                onMouseLeave={e => e.currentTarget.style.background = '#37475A'}
            >
                Back to top ↑
            </div>

            {/* Trust badges */}
            <div style={{ background: '#232F3E', padding: '32px 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, textAlign: 'center' }}>
                        {[
                            { icon: <FiTruck size={24} />, title: 'Free Delivery', sub: 'Orders above ₹499' },
                            { icon: <FiRefreshCw size={24} />, title: '30 Days Return', sub: 'Hassle-free returns' },
                            { icon: <FiShield size={24} />, title: 'Secure Payment', sub: '100% encrypted' },
                            { icon: <FiGift size={24} />, title: 'Special Offers', sub: 'On every season' },
                        ].map(({ icon, title, sub }) => (
                            <div key={title} style={{ color: '#fff' }}>
                                <div style={{ color: '#FF9900', marginBottom: 10 }}>{icon}</div>
                                <h4 style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{title}</h4>
                                <p style={{ fontSize: 12, color: '#aaa', fontWeight: 300 }}>{sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main footer */}
            <div style={{ background: '#131921', padding: '45px 0 32px' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 36, marginBottom: 40 }}>
                        {FOOTER_LINKS.map(col => (
                            <div key={col.heading}>
                                <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 500, marginBottom: 14 }}>{col.heading}</h4>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {col.links.map(l => (
                                        <li key={l.label}>
                                            <Link to={l.to} style={{ color: '#DDD', fontSize: 13, fontWeight: 300, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.15s' }}
                                                onMouseEnter={e => e.currentTarget.style.color = '#FF9900'}
                                                onMouseLeave={e => e.currentTarget.style.color = '#DDD'}>
                                                {l.icon} {l.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Newsletter */}
                        <div>
                            <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Stay Connected</h4>
                            <p style={{ color: '#aaa', fontSize: 12, fontWeight: 300, lineHeight: 1.7, marginBottom: 14 }}>
                                Subscribe for deals, new arrivals and exclusive offers.
                            </p>
                            <div style={{ display: 'flex', border: '1px solid #37475A', borderRadius: 4, overflow: 'hidden' }}>
                                <input
                                    type="email"
                                    placeholder="Enter email address"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                                    style={{ flex: 1, padding: '9px 12px', background: '#232F3E', border: 'none', outline: 'none', color: '#fff', fontSize: 13, fontFamily: 'inherit', fontWeight: 300 }}
                                />
                                <button onClick={handleSubscribe} style={{ padding: '9px 12px', background: '#FF9900', border: 'none', cursor: 'pointer', color: '#111' }}>
                                    <FiSend size={15} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                                {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
                                    <a key={i} href="#!" style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #37475A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', transition: 'all 0.15s' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF9900'; e.currentTarget.style.color = '#FF9900'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#37475A'; e.currentTarget.style.color = '#aaa'; }}>
                                        <Icon size={14} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: '1px solid #232F3E', paddingTop: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                            <Link to="/" style={{ fontSize: 20, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>
                                Shop<span style={{ color: '#FF9900' }}>Hub</span>
                            </Link>
                            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                                {['Conditions of Use', 'Privacy Notice', 'Help', 'Contact Us'].map(l => (
                                    <Link key={l} to={l.toLowerCase().includes('contact') ? '/contact' : '#'}
                                        style={{ color: '#aaa', fontSize: 12, fontWeight: 300, textDecoration: 'none' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
                                        {l}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <p style={{ color: '#555', fontSize: 12, fontWeight: 300, textAlign: 'center', marginTop: 20 }}>
                            © {new Date().getFullYear()}, ShopHub Technologies Pvt. Ltd. or its affiliates. All rights reserved.
                        </p>
                        <p style={{ color: '#444', fontSize: 11, textAlign: 'center', marginTop: 6, fontWeight: 300 }}>
                            Made with ❤️ in India. Free delivery on eligible orders.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
