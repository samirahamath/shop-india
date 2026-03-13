import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const { login, loading, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = new URLSearchParams(location.search).get('redirect') || '/';

    useEffect(() => {
        if (user) navigate(redirect);
    }, [user, navigate, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const ok = await login(email, password);
        if (ok) navigate(redirect);
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {/* Logo */}
                <Link to="/" style={styles.logo}>Shop<span style={{ color: '#FF9900' }}>Hub</span></Link>

                <h1 style={styles.heading}>Sign In</h1>

                <form onSubmit={submitHandler}>
                    <div className="form-group" style={{ marginBottom: 15 }}>
                        <span style={styles.label}>Email address</span>
                        <div style={styles.inputWrap}>
                            <FiMail style={styles.inputIcon} />
                            <input
                                type="email"
                                className="form-control"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={{ paddingLeft: 42, height: 42 }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 20 }}>
                        <span style={styles.label}>Password</span>
                        <div style={styles.inputWrap}>
                            <FiLock style={styles.inputIcon} />
                            <input
                                type={showPass ? 'text' : 'password'}
                                className="form-control"
                                placeholder="Minimum 6 characters"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                style={{ paddingLeft: 42, paddingRight: 42, height: 42 }}
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                                {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                        style={styles.submitBtn}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p style={styles.terms}>
                    By continuing, you agree to ShopHub's{' '}
                    <a href="#!">Conditions of Use</a> and <a href="#!">Privacy Notice</a>.
                </p>

                <div style={styles.divider}><span>New to ShopHub?</span></div>

                <Link
                    to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'}
                    className="btn"
                    style={styles.createBtn}
                >
                    Create your ShopHub account
                </Link>
            </div>

            {/* Footer links */}
            <div style={styles.footer}>
                <a href="#!">Help</a>
                <a href="#!">Privacy</a>
                <a href="#!">Terms</a>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 16px',
    },
    card: {
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: '28px 32px',
        marginTop: 16,
        backgroundColor: '#fff',
    },
    logo: {
        display: 'block',
        textAlign: 'center',
        fontSize: 28,
        fontWeight: 700,
        color: '#131921',
        marginBottom: 20,
        textDecoration: 'none',
    },
    heading: {
        fontSize: 24,
        fontWeight: 400,
        marginBottom: 20,
        color: '#0f1111',
    },
    label: {
        display: 'block',
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 5,
        color: '#0f1111',
    },
    inputWrap: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    inputIcon: {
        position: 'absolute',
        left: 14,
        color: '#565959',
        fontSize: 18,
        zIndex: 1,
        pointerEvents: 'none',
    },
    eyeBtn: {
        position: 'absolute',
        right: 12,
        background: 'none',
        border: 'none',
        color: '#565959',
        cursor: 'pointer',
        padding: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitBtn: {
        width: '100%',
        padding: '10px',
        fontSize: 14,
        marginTop: 4,
        marginBottom: 12,
        background: 'linear-gradient(to bottom, #f7dfa5, #f0c14b)',
        border: '1px solid #a88734',
        borderRadius: 4,
        fontWeight: 500,
        cursor: 'pointer',
        color: '#111',
    },
    terms: {
        fontSize: 12,
        color: '#565959',
        lineHeight: 1.6,
        marginBottom: 16,
    },
    divider: {
        textAlign: 'center',
        position: 'relative',
        margin: '20px 0',
        fontSize: 12,
        color: '#767676',
    },
    createBtn: {
        display: 'block',
        width: '100%',
        textAlign: 'center',
        padding: '10px',
        fontSize: 13,
        background: 'linear-gradient(to bottom, #f7f8fa, #e7e9ec)',
        border: '1px solid #adb1b8',
        borderRadius: 4,
        color: '#111',
        textDecoration: 'none',
    },
    footer: {
        display: 'flex',
        gap: 20,
        marginTop: 30,
        fontSize: 12,
        color: '#007185',
    },
};

export default Login;
