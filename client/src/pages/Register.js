import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [err, setErr] = useState('');
    const { register, loading, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirect = new URLSearchParams(location.search).get('redirect') || '/';

    useEffect(() => { if (user) navigate(redirect); }, [user, navigate, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setErr('');
        if (password !== confirm) { setErr('Passwords do not match'); return; }
        if (password.length < 6) { setErr('Password must be at least 6 characters'); return; }
        const ok = await register(name, email, password);
        if (ok) navigate(redirect);
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <Link to="/" style={styles.logo}>Shop<span style={{ color: '#FF9900' }}>Hub</span></Link>
                <h1 style={styles.heading}>Create account</h1>

                {err && <div className="alert alert-danger">{err}</div>}

                <form onSubmit={submitHandler}>
                    {[
                        { label: 'Your name', val: name, set: setName, type: 'text', icon: <FiUser />, ph: 'First and last name' },
                        { label: 'Email address', val: email, set: setEmail, type: 'email', icon: <FiMail />, ph: 'you@example.com' },
                    ].map(({ label, val, set, type, icon, ph }) => (
                        <div className="form-group" key={label} style={{ marginBottom: 15 }}>
                            <label style={styles.label}>{label}</label>
                            <div style={styles.inputWrap}>
                                <span style={styles.inputIcon}>{icon}</span>
                                <input type={type} className="form-control" placeholder={ph} value={val}
                                    onChange={e => set(e.target.value)} required style={{ paddingLeft: 42, height: 42 }} />
                            </div>
                        </div>
                    ))}

                    <div className="form-group" style={{ marginBottom: 15 }}>
                        <label style={styles.label}>Password</label>
                        <div style={styles.inputWrap}>
                            <span style={styles.inputIcon}><FiLock /></span>
                            <input type={showPass ? 'text' : 'password'} className="form-control"
                                placeholder="At least 6 characters" value={password}
                                onChange={e => setPassword(e.target.value)} required style={{ paddingLeft: 42, paddingRight: 42, height: 42 }} />
                            <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                                {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 20 }}>
                        <label style={styles.label}>Re-enter password</label>
                        <div style={styles.inputWrap}>
                            <span style={styles.inputIcon}><FiLock /></span>
                            <input type={showPass ? 'text' : 'password'} className="form-control"
                                placeholder="Re-enter password" value={confirm}
                                onChange={e => setConfirm(e.target.value)} required style={{ paddingLeft: 42, height: 42 }} />
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        style={{ width: '100%', padding: '10px', background: 'linear-gradient(to bottom, #f7dfa5, #f0c14b)', border: '1px solid #a88734', borderRadius: 4, fontWeight: 500, cursor: 'pointer', color: '#111', fontSize: 14, marginBottom: 12 }}>
                        {loading ? 'Creating...' : 'Create your ShopHub account'}
                    </button>
                </form>

                <p style={{ fontSize: 12, color: '#565959', lineHeight: 1.6 }}>
                    By creating an account, you agree to ShopHub's{' '}
                    <a href="#!" style={{ color: '#007185' }}>Conditions of Use</a> and{' '}
                    <a href="#!" style={{ color: '#007185' }}>Privacy Notice</a>.
                </p>

                <div style={{ margin: '16px 0', borderTop: '1px solid #ddd', paddingTop: 16, fontSize: 13 }}>
                    Already have an account?{' '}
                    <Link to={redirect !== '/' ? `/login?redirect=${redirect}` : '/login'} style={{ color: '#007185' }}>
                        Sign in ›
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px' },
    card: { width: '100%', maxWidth: '420px', border: '1px solid #ddd', borderRadius: 8, padding: '28px 32px', marginTop: 16 },
    logo: { display: 'block', textAlign: 'center', fontSize: 28, fontWeight: 700, color: '#131921', marginBottom: 20, textDecoration: 'none' },
    heading: { fontSize: 24, fontWeight: 400, marginBottom: 20, color: '#0f1111' },
    label: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#0f1111' },
    inputWrap: { position: 'relative', display: 'flex', alignItems: 'center', width: '100%' },
    inputIcon: { position: 'absolute', left: 14, color: '#565959', fontSize: 18, display: 'flex', zIndex: 1, pointerEvents: 'none' },
    eyeBtn: { position: 'absolute', right: 12, background: 'none', border: 'none', color: '#565959', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' },
};

export default Register;
