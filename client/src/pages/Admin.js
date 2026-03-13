import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2, FiPlus, FiStar, FiUsers, FiShoppingBag, FiPackage, FiDollarSign, FiSearch, FiShield, FiUser, FiCheck, FiX, FiRefreshCw, FiSettings, FiEye, FiEyeOff, FiSave, FiLink, FiTruck, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const TABS = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'products',  label: '🛍 Products'  },
    { id: 'orders',    label: '📦 Orders'    },
    { id: 'reviews',   label: '⭐ Reviews'   },
    { id: 'users',     label: '👥 Users'     },
    { id: 'settings',  label: '⚙ Settings'  },
];
const ORDER_STATUSES = ['Pending','Confirmed','Processing','Shipped','Out for Delivery','Delivered','Cancelled'];
const CATEGORIES = ['Electronics','Clothing','Books','Home','Sports','Beauty','Toys','Grocery'];
const STATUS_COLOR = { Pending:'#e77600', Confirmed:'#007600', Processing:'#007185', Shipped:'#565959', 'Out for Delivery':'#cc0c39', Delivered:'#007600', Cancelled:'#cc0c39' };

function StatCard({ icon, label, value, color }) {
    return (
        <div style={{ background:'#fff', borderRadius:8, padding:'20px 24px', border:'1px solid #eee', display:'flex', alignItems:'center', gap:16, boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ width:52, height:52, borderRadius:12, background:color+'20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, color }}>{icon}</div>
            <div>
                <p style={{ margin:0, fontSize:13, color:'#565959' }}>{label}</p>
                <p style={{ margin:'2px 0 0', fontSize:24, fontWeight:700, color:'#131921' }}>{value}</p>
            </div>
        </div>
    );
}
function Stars({ n }) {
    return <span style={{ color:'#e77600', fontSize:13 }}>{'★'.repeat(Math.round(n))}{'☆'.repeat(5-Math.round(n))} <span style={{ color:'#888' }}>{n}/5</span></span>;
}

export default function Admin() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ products:0, orders:0, users:0, reviews:0, revenue:0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState([]);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({ name:'', price:'', description:'', category:'', stock:0, brand:'', images:[] });
    const [productSearch, setProductSearch] = useState('');
    const [orderSearch, setOrderSearch] = useState('');
    const [reviewSearch, setReviewSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');
    // Settings tab state
    const [settingsLoading, setSettingsLoading] = useState(false);
    const [settings, setSettings] = useState(null);
    const [settingsForm, setSettingsForm] = useState({});
    const [showStripeSecret, setShowStripeSecret] = useState(false);
    const [showJwtSecret, setShowJwtSecret] = useState(false);

    // Auth is already guaranteed by RequireAdmin in App.js — this is just a safety net
    useEffect(() => {
        if (!user) { navigate('/login?redirect=/admin', { replace: true }); return; }
        if (user.role !== 'admin') { navigate('/', { replace: true }); }
    }, [user, navigate]);

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        try {
            const [pRes, oRes, uRes, rRes] = await Promise.all([
                api.get('/products?limit=1'),
                api.get('/orders'),
                api.get('/users'),
                api.get('/reviews'),
            ]);
            const allOrders = oRes.data || [];
            const revenue = allOrders.reduce((s, o) => s + (o.totalPrice || o.pricing?.totalPrice || 0), 0);
            setStats({ products: pRes.data.total || pRes.data.products?.length || 0, orders: allOrders.length, users: (uRes.data||[]).length, reviews: (rRes.data||[]).length, revenue });
            setRecentOrders(allOrders.slice(0, 6));
        } catch { toast.error('Failed to load stats'); }
        setLoading(false);
    }, []);

    useEffect(() => { if (activeTab === 'dashboard') loadDashboard(); }, [activeTab, loadDashboard]);

    useEffect(() => {
        if (activeTab === 'products') { setLoading(true); api.get('/products?limit=200').then(r => setProducts(r.data.products || r.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false)); }
    }, [activeTab]);
    useEffect(() => {
        if (activeTab === 'orders') { setLoading(true); api.get('/orders').then(r => setOrders(r.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false)); }
    }, [activeTab]);
    useEffect(() => {
        if (activeTab === 'reviews') { setLoading(true); api.get('/reviews').then(r => setReviews(r.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false)); }
    }, [activeTab]);
    useEffect(() => {
        if (activeTab === 'users') { setLoading(true); api.get('/users').then(r => setUsers(r.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false)); }
    }, [activeTab]);

    const loadSettings = useCallback(async () => {
        setSettingsLoading(true);
        try {
            const r = await api.get('/settings/admin');
            setSettings(r.data);
            setSettingsForm(r.data);
        } catch { toast.error('Failed to load settings'); }
        setSettingsLoading(false);
    }, []);
    useEffect(() => { if (activeTab === 'settings') loadSettings(); }, [activeTab, loadSettings]);

    // ── Product handlers ──────────────────────────────────────────────────────
    const resetPF = () => { setProductForm({ name:'', price:'', description:'', category:'', stock:0, brand:'', images:[] }); setEditingProduct(null); setShowProductForm(false); };
    const handleSubmitProduct = (e) => {
        e.preventDefault();
        const p = { ...productForm, price: Number(productForm.price), stock: Number(productForm.stock) };
        if (editingProduct) {
            api.put('/products/' + editingProduct, p).then(() => { setProducts(products.map(x => x._id === editingProduct ? { ...x, ...p } : x)); resetPF(); toast.success('Product updated!'); }).catch(() => toast.error('Failed'));
        } else {
            api.post('/products', p).then(r => { setProducts([r.data, ...products]); resetPF(); toast.success('Product created!'); }).catch(() => toast.error('Failed'));
        }
    };
    const handleEditProduct = (p) => { setProductForm({ name:p.name, price:p.price, description:p.description, category:p.category, stock:p.stock, brand:p.brand||'', images:p.images||[] }); setEditingProduct(p._id); setShowProductForm(true); window.scrollTo({ top:0, behavior:'smooth' }); };
    const handleDeleteProduct = (id) => { if (!window.confirm('Delete this product?')) return; api.delete('/products/' + id).then(() => { setProducts(products.filter(p => p._id !== id)); toast.success('Deleted'); }).catch(() => toast.error('Failed')); };
    // ── Order handlers ────────────────────────────────────────────────────────
    const handleUpdateStatus = (id, status) => { api.put('/orders/' + id + '/status', { status }).then(() => { setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: status } : o)); toast.success('Status updated'); }).catch(() => toast.error('Failed')); };
    // ── Review handlers ───────────────────────────────────────────────────────
    const handleDeleteReview = (id) => { if (!window.confirm('Delete this review?')) return; api.delete('/reviews/' + id).then(() => { setReviews(reviews.filter(r => r._id !== id)); toast.success('Review deleted'); }).catch(() => toast.error('Failed')); };
    // ── User handlers ─────────────────────────────────────────────────────────
    const handleToggleRole = (u) => { const r = u.role === 'admin' ? 'user' : 'admin'; if (!window.confirm("Change " + u.name + " to " + r + "?")) return; api.put('/users/' + u._id, { role: r }).then(() => { setUsers(users.map(x => x._id === u._id ? { ...x, role: r } : x)); toast.success('Role updated'); }).catch(() => toast.error('Failed')); };
    const handleDeleteUser = (u) => { if (u._id === user._id) { toast.error("Can't delete yourself!"); return; } if (!window.confirm('Delete user "' + u.name + '"?')) return; api.delete('/users/' + u._id).then(() => { setUsers(users.filter(x => x._id !== u._id)); toast.success('User deleted'); }).catch(() => toast.error('Failed')); };

    // ── Settings handlers ─────────────────────────────────────────────────────
    const sfChange = (k, v) => setSettingsForm(prev => ({ ...prev, [k]: v }));
    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            await api.put('/settings', settingsForm);
            toast.success('Settings saved!');
            loadSettings();
        } catch { toast.error('Failed to save settings'); }
    };

    if (!user || user.role !== 'admin') return null;

    const th = { padding:'10px 14px', textAlign:'left', fontWeight:600, fontSize:11, color:'#666', textTransform:'uppercase', letterSpacing:0.4, background:'#f9f9f9', borderBottom:'2px solid #eee' };
    const td = { padding:'11px 14px', fontSize:13, borderBottom:'1px solid #f3f3f3', verticalAlign:'middle' };

    const fProd = products.filter(p => p.name?.toLowerCase().includes(productSearch.toLowerCase()) || p.category?.toLowerCase().includes(productSearch.toLowerCase()));
    const fOrd  = orders.filter(o => o._id?.includes(orderSearch) || o.user?.name?.toLowerCase().includes(orderSearch.toLowerCase()) || o.user?.email?.toLowerCase().includes(orderSearch.toLowerCase()));
    const fRev  = reviews.filter(r => r.comment?.toLowerCase().includes(reviewSearch.toLowerCase()) || r.name?.toLowerCase().includes(reviewSearch.toLowerCase()) || r.product?.name?.toLowerCase().includes(reviewSearch.toLowerCase()));
    const fUser = users.filter(u => u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase()));

    const searchBox = (val, setVal, ph) => (
        <div style={{ position:'relative', marginBottom:16, maxWidth:360 }}>
            <FiSearch style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#aaa', fontSize:14 }} />
            <input value={val} onChange={e => setVal(e.target.value)} placeholder={ph} style={{ width:'100%', padding:'8px 12px 8px 32px', border:'1px solid #ddd', borderRadius:6, fontSize:13, boxSizing:'border-box' }} />
        </div>
    );

    return (
        <div style={{ background:'#f0f2f5', minHeight:'100vh' }}>
            {/* Top bar */}
            <div style={{ background:'#131921', color:'#fff', padding:'0 28px', display:'flex', alignItems:'center', gap:20, height:58, position:'sticky', top:0, zIndex:200, boxShadow:'0 2px 8px rgba(0,0,0,0.2)' }}>
                <span style={{ fontWeight:800, fontSize:19 }}>
                    <span style={{ color:'#fff' }}>Shop</span><span style={{ color:'#FF9900' }}>Hub</span>
                </span>
                <span style={{ background:'#FF9900', color:'#131921', padding:'2px 7px', borderRadius:4, fontWeight:700, fontSize:10, letterSpacing:0.5 }}>ADMIN</span>
                <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8, fontSize:13 }}>
                    <FiUser style={{ color:'#FF9900' }} />
                    <span>{user.name}</span>
                </div>
            </div>

            <div style={{ display:'flex', minHeight:'calc(100vh - 58px)' }}>
                {/* Sidebar */}
                <div style={{ width:210, background:'#fff', borderRight:'1px solid #eee', paddingTop:16, flexShrink:0 }}>
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'11px 22px', border:'none', background: activeTab===tab.id ? '#fff8ee' : 'transparent', borderLeft: activeTab===tab.id ? '3px solid #FF9900' : '3px solid transparent', color: activeTab===tab.id ? '#FF9900' : '#444', fontWeight: activeTab===tab.id ? 600 : 400, fontSize:14, cursor:'pointer', textAlign:'left' }}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div style={{ flex:1, padding:'28px 32px', overflowY:'auto', maxWidth:'100%' }}>

                    {/* ── DASHBOARD ─────────────────────────────────────── */}
                    {activeTab === 'dashboard' && (
                        <div>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
                                <h2 style={{ margin:0, fontSize:21, fontWeight:700, color:'#131921' }}>Dashboard Overview</h2>
                                <button onClick={loadDashboard} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'#fff', border:'1px solid #ddd', borderRadius:6, cursor:'pointer', fontSize:13 }}><FiRefreshCw size={13}/> Refresh</button>
                            </div>
                            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:14, marginBottom:26 }}>
                                <StatCard icon={<FiShoppingBag/>} label="Products" value={stats.products} color="#007185"/>
                                <StatCard icon={<FiPackage/>} label="Orders" value={stats.orders} color="#e77600"/>
                                <StatCard icon={<FiUsers/>} label="Users" value={stats.users} color="#cc0c39"/>
                                <StatCard icon={<FiStar/>} label="Reviews" value={stats.reviews} color="#FF9900"/>
                                <StatCard icon={<FiDollarSign/>} label="Revenue" value={"Rs."+stats.revenue.toLocaleString()} color="#007600"/>
                            </div>
                            <div style={{ background:'#fff', borderRadius:8, border:'1px solid #eee', padding:22 }}>
                                <h3 style={{ margin:'0 0 14px', fontSize:15, fontWeight:600 }}>Recent Orders</h3>
                                {loading && <div className="loader"/>}
                                {!loading && recentOrders.length === 0 && <p style={{ color:'#aaa', textAlign:'center', padding:24 }}>No orders yet</p>}
                                {!loading && recentOrders.length > 0 && (
                                    <div style={{ overflowX:'auto' }}>
                                        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                                            <thead><tr><th style={th}>Order ID</th><th style={th}>Customer</th><th style={th}>Amount</th><th style={th}>Status</th><th style={th}>Date</th></tr></thead>
                                            <tbody>{recentOrders.map(o => (
                                                <tr key={o._id}>
                                                    <td style={td}><code style={{ background:'#f3f3f3', padding:'2px 6px', borderRadius:3, fontSize:10 }}>#{o._id.slice(-8).toUpperCase()}</code></td>
                                                    <td style={td}><div>{o.user?.name||'N/A'}</div><div style={{ fontSize:11, color:'#aaa' }}>{o.user?.email}</div></td>
                                                    <td style={td}>Rs.{(o.totalPrice||o.pricing?.totalPrice||0).toLocaleString()}</td>
                                                    <td style={td}><span style={{ background:(STATUS_COLOR[o.orderStatus]||'#aaa')+'22', color:STATUS_COLOR[o.orderStatus]||'#aaa', padding:'3px 8px', borderRadius:10, fontSize:11, fontWeight:600 }}>{o.orderStatus||'Pending'}</span></td>
                                                    <td style={td}>{new Date(o.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                                                </tr>
                                            ))}</tbody>
                                        </table>
                                    </div>
                                )}
                                {!loading && recentOrders.length > 0 && <button onClick={() => setActiveTab('orders')} style={{ marginTop:10, background:'none', border:'none', color:'#007185', cursor:'pointer', fontSize:13, fontWeight:500 }}>View all orders →</button>}
                            </div>
                        </div>
                    )}

                    {/* ── PRODUCTS ──────────────────────────────────────── */}
                    {activeTab === 'products' && (
                        <div>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                                <h2 style={{ margin:0, fontSize:21, fontWeight:700, color:'#131921' }}>Products <span style={{ fontWeight:400, color:'#aaa', fontSize:15 }}>({fProd.length})</span></h2>
                                <button onClick={() => { resetPF(); setShowProductForm(v => !v); }} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', background:'#FF9900', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontWeight:600, fontSize:13 }}><FiPlus/> Add Product</button>
                            </div>
                            {showProductForm && (
                                <div style={{ background:'#fff', borderRadius:8, border:'2px solid #FF9900', padding:22, marginBottom:22 }}>
                                    <h3 style={{ margin:'0 0 14px', fontSize:15, fontWeight:600 }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                    <form onSubmit={handleSubmitProduct}>
                                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                                            <div className="form-group"><label>Name *</label><input className="form-control" value={productForm.name} onChange={e => setProductForm({...productForm,name:e.target.value})} required /></div>
                                            <div className="form-group"><label>Brand</label><input className="form-control" value={productForm.brand} onChange={e => setProductForm({...productForm,brand:e.target.value})} /></div>
                                            <div className="form-group"><label>Price (Rs.) *</label><input type="number" className="form-control" value={productForm.price} onChange={e => setProductForm({...productForm,price:e.target.value})} required min="0"/></div>
                                            <div className="form-group"><label>Stock *</label><input type="number" className="form-control" value={productForm.stock} onChange={e => setProductForm({...productForm,stock:e.target.value})} required min="0"/></div>
                                            <div className="form-group"><label>Category *</label><select className="form-control" value={productForm.category} onChange={e => setProductForm({...productForm,category:e.target.value})} required><option value="">Select</option>{CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                                            <div className="form-group"><label>Image URL</label><input className="form-control" value={(productForm.images||[])[0]||''} onChange={e => setProductForm({...productForm,images:[e.target.value]})} placeholder="https://..."/></div>
                                        </div>
                                        <div className="form-group" style={{ marginBottom:14 }}><label>Description *</label><textarea className="form-control" rows={3} value={productForm.description} onChange={e => setProductForm({...productForm,description:e.target.value})} required /></div>
                                        <div style={{ display:'flex', gap:10 }}>
                                            <button type="submit" style={{ padding:'9px 20px', background:'#FF9900', color:'#fff', border:'none', borderRadius:6, fontWeight:600, cursor:'pointer' }}>{editingProduct ? 'Update' : 'Create'}</button>
                                            <button type="button" onClick={resetPF} style={{ padding:'9px 16px', background:'#f3f3f3', color:'#444', border:'1px solid #ddd', borderRadius:6, cursor:'pointer' }}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                            {searchBox(productSearch, setProductSearch, 'Search products...')}
                            {loading && <div className="loader"/>}
                            {!loading && (
                                <div style={{ background:'#fff', borderRadius:8, border:'1px solid #eee', overflowX:'auto' }}>
                                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                                        <thead><tr><th style={th}>Product</th><th style={th}>Category</th><th style={th}>Price</th><th style={th}>Stock</th><th style={th}>Rating</th><th style={{...th,textAlign:'center'}}>Actions</th></tr></thead>
                                        <tbody>
                                            {fProd.length===0 && <tr><td colSpan={6} style={{...td,textAlign:'center',color:'#aaa',padding:36}}>No products</td></tr>}
                                            {fProd.map(p => (
                                                <tr key={p._id} onMouseEnter={e=>e.currentTarget.style.background='#fafafa'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                                                    <td style={td}>
                                                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                                            {p.images?.[0] && <img src={p.images[0]} alt="" style={{ width:38,height:38,objectFit:'cover',borderRadius:4,border:'1px solid #eee' }} onError={e=>e.target.style.display='none'}/>}
                                                            <div><div style={{ fontWeight:500 }}>{p.name?.substring(0,40)}{p.name?.length>40?'...':''}</div>{p.brand&&<div style={{ fontSize:11,color:'#aaa' }}>{p.brand}</div>}</div>
                                                        </div>
                                                    </td>
                                                    <td style={td}><span style={{ background:'#f0f2f5', padding:'3px 8px', borderRadius:10, fontSize:11 }}>{p.category}</span></td>
                                                    <td style={{...td,fontWeight:600,color:'#B12704'}}>Rs.{Number(p.price).toLocaleString()}</td>
                                                    <td style={td}><span style={{ color:p.stock<10?'#cc0c39':'#007600', fontWeight:500 }}>{p.stock}</span></td>
                                                    <td style={td}><Stars n={p.rating||0}/></td>
                                                    <td style={{...td,textAlign:'center'}}>
                                                        <button onClick={()=>handleEditProduct(p)} style={{ background:'none',border:'none',cursor:'pointer',color:'#007185',padding:5 }}><FiEdit size={14}/></button>
                                                        <button onClick={()=>handleDeleteProduct(p._id)} style={{ background:'none',border:'none',cursor:'pointer',color:'#cc0c39',padding:5 }}><FiTrash2 size={14}/></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── ORDERS ────────────────────────────────────────── */}
                    {activeTab === 'orders' && (
                        <div>
                            <h2 style={{ margin:'0 0 18px', fontSize:21, fontWeight:700, color:'#131921' }}>All Orders <span style={{ fontWeight:400, color:'#aaa', fontSize:15 }}>({fOrd.length})</span></h2>
                            {searchBox(orderSearch, setOrderSearch, 'Search by order ID or customer...')}
                            {loading && <div className="loader"/>}
                            {!loading && fOrd.length===0 && <p style={{ textAlign:'center', padding:50, color:'#aaa' }}>No orders found</p>}
                            {!loading && fOrd.map(order => (
                                <div key={order._id} style={{ background:'#fff', borderRadius:8, border:'1px solid #eee', padding:18, marginBottom:14, boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
                                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                                        <div style={{ flex:1, minWidth:0 }}>
                                            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:5 }}>
                                                <code style={{ background:'#f3f3f3', padding:'3px 7px', borderRadius:3, fontSize:11, fontWeight:600 }}>#{order._id.slice(-10).toUpperCase()}</code>
                                                <span style={{ background:(STATUS_COLOR[order.orderStatus]||'#aaa')+'22', color:STATUS_COLOR[order.orderStatus]||'#aaa', padding:'3px 9px', borderRadius:10, fontSize:11, fontWeight:600 }}>{order.orderStatus||'Pending'}</span>
                                                {order.isPaid && <span style={{ background:'#00760022', color:'#007600', padding:'3px 9px', borderRadius:10, fontSize:11, fontWeight:600 }}>Paid</span>}
                                            </div>
                                            <p style={{ margin:'0 0 3px', fontSize:13 }}><strong>{order.user?.name||'Unknown'}</strong><span style={{ color:'#aaa', marginLeft:8, fontSize:12 }}>{order.user?.email}</span></p>
                                            <p style={{ margin:0, fontSize:12, color:'#565959' }}>{order.orderItems?.length||0} item(s) &bull; Rs.{(order.totalPrice||order.pricing?.totalPrice||0).toLocaleString()}{order.shippingAddress?.city && <> &bull; {order.shippingAddress.city}</>}</p>
                                            <p style={{ margin:'3px 0 0', fontSize:11, color:'#aaa' }}>{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                                            {order.orderItems?.length > 0 && <div style={{ marginTop:7, display:'flex', flexWrap:'wrap', gap:5 }}>{order.orderItems.map((item,i) => <span key={i} style={{ background:'#f0f2f5', padding:'2px 7px', borderRadius:10, fontSize:11 }}>{item.name?.substring(0,22)} x{item.qty}</span>)}</div>}
                                        </div>
                                        <div>
                                            <label style={{ display:'block', fontSize:11, color:'#aaa', marginBottom:3 }}>Update Status</label>
                                            <select value={order.orderStatus||'Pending'} onChange={e=>handleUpdateStatus(order._id,e.target.value)} style={{ padding:'7px 11px', borderRadius:6, border:'1px solid #ddd', fontSize:12, cursor:'pointer', background:'#fff', minWidth:155 }}>
                                                {ORDER_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── REVIEWS ───────────────────────────────────────── */}
                    {activeTab === 'reviews' && (
                        <div>
                            <h2 style={{ margin:'0 0 18px', fontSize:21, fontWeight:700, color:'#131921' }}>Reviews <span style={{ fontWeight:400, color:'#aaa', fontSize:15 }}>({fRev.length})</span></h2>
                            {searchBox(reviewSearch, setReviewSearch, 'Search by reviewer, product, comment...')}
                            {loading && <div className="loader"/>}
                            {!loading && (
                                <div style={{ background:'#fff', borderRadius:8, border:'1px solid #eee', overflowX:'auto' }}>
                                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                                        <thead><tr><th style={th}>Reviewer</th><th style={th}>Product</th><th style={th}>Rating</th><th style={th}>Review</th><th style={th}>Verified</th><th style={th}>Date</th><th style={{...th,textAlign:'center'}}>Delete</th></tr></thead>
                                        <tbody>
                                            {fRev.length===0 && <tr><td colSpan={7} style={{...td,textAlign:'center',color:'#aaa',padding:36}}>No reviews found</td></tr>}
                                            {fRev.map(r => (
                                                <tr key={r._id} onMouseEnter={e=>e.currentTarget.style.background='#fafafa'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                                                    <td style={td}><div style={{ fontWeight:500 }}>{r.name||r.user?.name}</div><div style={{ fontSize:11,color:'#aaa' }}>{r.user?.email}</div></td>
                                                    <td style={td}><span style={{ color:'#007185' }}>{r.product?.name?.substring(0,28)||'N/A'}</span></td>
                                                    <td style={td}><Stars n={r.rating}/></td>
                                                    <td style={{...td,maxWidth:250}}>
                                                        {r.title && <div style={{ fontWeight:600, fontSize:12, marginBottom:2 }}>{r.title}</div>}
                                                        <div style={{ color:'#565959', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:230 }}>{r.comment}</div>
                                                    </td>
                                                    <td style={td}>{r.verified ? <FiCheck color="#007600" size={14}/> : <FiX color="#cc0c39" size={14}/>}</td>
                                                    <td style={td}>{new Date(r.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td>
                                                    <td style={{...td,textAlign:'center'}}>
                                                        <button onClick={()=>handleDeleteReview(r._id)} style={{ background:'none',border:'none',cursor:'pointer',color:'#cc0c39',padding:5 }}><FiTrash2 size={14}/></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── USERS ─────────────────────────────────────────── */}
                    {activeTab === 'users' && (
                        <div>
                            <h2 style={{ margin:'0 0 18px', fontSize:21, fontWeight:700, color:'#131921' }}>Users <span style={{ fontWeight:400, color:'#aaa', fontSize:15 }}>({fUser.length})</span></h2>
                            {searchBox(userSearch, setUserSearch, 'Search by name or email...')}
                            {loading && <div className="loader"/>}
                            {!loading && (
                                <div style={{ background:'#fff', borderRadius:8, border:'1px solid #eee', overflowX:'auto' }}>
                                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                                        <thead><tr><th style={th}>User</th><th style={th}>Email</th><th style={th}>Role</th><th style={th}>Joined</th><th style={{...th,textAlign:'center'}}>Actions</th></tr></thead>
                                        <tbody>
                                            {fUser.length===0 && <tr><td colSpan={5} style={{...td,textAlign:'center',color:'#aaa',padding:36}}>No users found</td></tr>}
                                            {fUser.map(u => (
                                                <tr key={u._id} onMouseEnter={e=>e.currentTarget.style.background='#fafafa'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                                                    <td style={td}>
                                                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                                            <div style={{ width:34,height:34,borderRadius:'50%',background:u.role==='admin'?'#FF9900':'#007185',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:13,flexShrink:0 }}>{u.name?.charAt(0).toUpperCase()||'?'}</div>
                                                            <span style={{ fontWeight:500 }}>{u.name}</span>
                                                            {u._id===user._id && <span style={{ fontSize:9,background:'#007185',color:'#fff',padding:'1px 5px',borderRadius:6 }}>YOU</span>}
                                                        </div>
                                                    </td>
                                                    <td style={td}>{u.email}</td>
                                                    <td style={td}>
                                                        <span style={{ display:'inline-flex',alignItems:'center',gap:4,background:u.role==='admin'?'#FF990022':'#f0f2f5',color:u.role==='admin'?'#e77600':'#444',padding:'3px 9px',borderRadius:10,fontWeight:600,fontSize:11 }}>
                                                            {u.role==='admin'&&<FiShield size={10}/>}{u.role==='admin'?'Admin':'User'}
                                                        </span>
                                                    </td>
                                                    <td style={td}>{new Date(u.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                                                    <td style={{...td,textAlign:'center'}}>
                                                        <button onClick={()=>handleToggleRole(u)} title={u.role==='admin'?'Demote':'Promote to admin'} style={{ background:'none',border:'none',cursor:'pointer',color:'#007185',padding:5 }}><FiShield size={14}/></button>
                                                        <button onClick={()=>handleDeleteUser(u)} title="Delete" disabled={u._id===user._id} style={{ background:'none',border:'none',cursor:u._id===user._id?'not-allowed':'pointer',color:u._id===user._id?'#ccc':'#cc0c39',padding:5 }}><FiTrash2 size={14}/></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── SETTINGS ──────────────────────────────────────── */}
                    {activeTab === 'settings' && (
                        <div>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
                                <h2 style={{ margin:0, fontSize:21, fontWeight:700, color:'#131921' }}>Store Settings</h2>
                                <button type="button" onClick={loadSettings} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'#fff', border:'1px solid #ddd', borderRadius:6, cursor:'pointer', fontSize:13 }}><FiRefreshCw size={13}/> Refresh</button>
                            </div>
                            {settingsLoading ? <div className="loader"/> : (
                                <form onSubmit={handleSaveSettings}>
                                    {/* Branding */}
                                    <div style={{ background:'#fff', borderRadius:8, border:'1px solid #eee', padding:22, marginBottom:18 }}>
                                        <h3 style={{ margin:'0 0 16px', fontSize:14, fontWeight:600, color:'#131921', display:'flex', alignItems:'center', gap:7 }}><FiLink size={15} color="#FF9900"/> Store Branding</h3>
                                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                                            <div className="form-group"><label style={{ fontSize:12, fontWeight:500, color:'#444', display:'block', marginBottom:5 }}>Store Name</label><input className="form-control" value={settingsForm.storeName||''} onChange={e => sfChange('storeName', e.target.value)}/></div>
                                            <div className="form-group"><label style={{ fontSize:12, fontWeight:500, color:'#444', display:'block', marginBottom:5 }}>Logo Text</label><input className="form-control" value={settingsForm.logoText||''} onChange={e => sfChange('logoText', e.target.value)}/></div>
                                            <div className="form-group"><label style={{ fontSize:12, fontWeight:500, color:'#444', display:'block', marginBottom:5 }}>Tagline</label><input className="form-control" value={settingsForm.tagline||''} onChange={e => sfChange('tagline', e.target.value)} placeholder="Your one-stop shop for everything"/></div>
                                            <div className="form-group"><label style={{ fontSize:12, fontWeight:500, color:'#444', display:'block', marginBottom:5 }}>Accent Color</label><input type="color" value={settingsForm.logoAccentColor||'#FF9900'} onChange={e => sfChange('logoAccentColor', e.target.value)} style={{ width:'100%', height:38, borderRadius:6, border:'1px solid #ddd', cursor:'pointer', padding:2 }}/></div>
                                            <div className="form-group" style={{ gridColumn:'span 2' }}><label style={{ fontSize:12, fontWeight:500, color:'#444', display:'block', marginBottom:5 }}>Footer Text</label><input className="form-control" value={settingsForm.footerText||''} onChange={e => sfChange('footerText', e.target.value)} placeholder="© 2026 ShopHub. All rights reserved."/></div>
                                        </div>
                                    </div>
                                    {/* Contact Info */}
                                    <div style={{ background:'#fff', borderRadius:8, border:'1px solid #eee', padding:22, marginBottom:18 }}>
                                        <h3 style={{ margin:'0 0 16px', fontSize:14, fontWeight:600, color:'#131921', display:'flex', alignItems:'center', gap:7 }}><FiMail size={15} color="#007185"/> Contact & Address</h3>
                                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                                            <div className="form-group"><label style={{ fontSize:12, fontWeight:500, color:'#444', display:'block', marginBottom:5 }}>Support Email</label><input type="email" className="form-control" value={settingsForm.supportEmail||''} onChange={e => sfChange('supportEmail', e.target.value)} placeholder="support@shophub.com"/></div>
                                            <div className="form-group"><label style={{ fontSize:12, fontWeight:500, color:'#444', display:'block', marginBottom:5 }}>Support Phone</label><input className="form-control" value={settingsForm.supportPhone||''} onChange={e => sfChange('supportPhone', e.target.value)} placeholder="+91 XXXXX XXXXX"/></div>
                                            <div className="form-group" style={{ gridColumn:'span 2' }}><label style={{ fontSize:12, fontWeight:500, color:'#444', display:'block', marginBottom:5 }}>Address</label><textarea className="form-control" rows={2} value={settingsForm.address||''} onChange={e => sfChange('address', e.target.value)} placeholder="123 Street, City, State - PIN"/></div>
                                        </div>
                                    </div>
                                    {/* Social Links */}
                                    <div style={{ background:'#fff', borderRadius:8, border:'1px solid #eee', padding:22, marginBottom:18 }}>
                                        <h3 style={{ margin:'0 0 16px', fontSize:14, fontWeight:600, color:'#131921', display:'flex', alignItems:'center', gap:7 }}><FiLink size={15} color="#1877F2"/> Social Media Links</h3>
                                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                                            <div className="form-group"><label style={{ fontSize:12, fontWeight:500, color:'#444', display:'block', marginBottom:5 }}>Facebook URL</label><input className="form-control" value={settingsForm.socialFacebook||''} onChange={e => sfChange('socialFacebook', e.target.value)} placeholder="https://facebook.com/..."/></div>
                                            <div className="form-group"><label style={{ fontSize:12, fontWeight:500, color:'#444', display:'block', marginBottom:5 }}>Twitter / X URL</label><input className="form-control" value={settingsForm.socialTwitter||''} onChange={e => sfChange('socialTwitter', e.target.value)} placeholder="https://twitter.com/..."/></div>
                                            <div className="form-group"><label style={{ fontSize:12, fontWeight:500, color:'#444', display:'block', marginBottom:5 }}>Instagram URL</label><input className="form-control" value={settingsForm.socialInstagram||''} onChange={e => sfChange('socialInstagram', e.target.value)} placeholder="https://instagram.com/..."/></div>
                                        </div>
                                    </div>
                                    {/* Store Config */}
                                    <div style={{ background:'#fff', borderRadius:8, border:'1px solid #eee', padding:22, marginBottom:18 }}>
                                        <h3 style={{ margin:'0 0 16px', fontSize:14, fontWeight:600, color:'#131921', display:'flex', alignItems:'center', gap:7 }}><FiTruck size={15} color="#007600"/> Store Configuration</h3>
                                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
                                            <div className="form-group"><label style={{ fontSize:12, fontWeight:500, color:'#444', display:'block', marginBottom:5 }}>Free Shipping Above (Rs.)</label><input type="number" className="form-control" value={settingsForm.freeShippingAbove||0} onChange={e => sfChange('freeShippingAbove', Number(e.target.value))} min="0"/></div>
                                            <div className="form-group"><label style={{ fontSize:12, fontWeight:500, color:'#444', display:'block', marginBottom:5 }}>Currency Code</label><input className="form-control" value={settingsForm.currency||'INR'} onChange={e => sfChange('currency', e.target.value)} placeholder="INR"/></div>
                                            <div className="form-group"><label style={{ fontSize:12, fontWeight:500, color:'#444', display:'block', marginBottom:5 }}>Currency Symbol</label><input className="form-control" value={settingsForm.currencySymbol||'₹'} onChange={e => sfChange('currencySymbol', e.target.value)} placeholder="₹"/></div>
                                        </div>
                                        <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:10 }}>
                                            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13 }}>
                                                <input type="checkbox" checked={!!settingsForm.maintenanceMode} onChange={e => sfChange('maintenanceMode', e.target.checked)} style={{ width:16, height:16 }}/>
                                                <span style={{ fontWeight:500 }}>Maintenance Mode</span>
                                                <span style={{ fontSize:12, color:'#aaa' }}>— When enabled, only admins can access the store</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div style={{ marginBottom:24 }}>
                                        <button type="submit" style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 22px', background:'#FF9900', color:'#fff', border:'none', borderRadius:6, fontWeight:600, fontSize:14, cursor:'pointer' }}>
                                            <FiSave size={15}/> Save Settings
                                        </button>
                                    </div>
                                </form>
                            )}
                            {/* API Keys — read-only */}
                            {settings && (
                                <div style={{ background:'#fff', borderRadius:8, border:'1px solid #eee', padding:22 }}>
                                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                                        <h3 style={{ margin:0, fontSize:14, fontWeight:600, color:'#131921', display:'flex', alignItems:'center', gap:7 }}><FiSettings size={15} color="#cc0c39"/> API Keys & Credentials</h3>
                                        <button type="button" onClick={() => setShowStripeSecret(v => !v)} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'1px solid #ddd', borderRadius:5, padding:'5px 12px', cursor:'pointer', fontSize:12, color:'#444' }}>
                                            {showStripeSecret ? <FiEyeOff size={13}/> : <FiEye size={13}/>} {showStripeSecret ? 'Hide' : 'Reveal'}
                                        </button>
                                    </div>
                                    <p style={{ margin:'0 0 14px', fontSize:12, color:'#e77600', background:'#fff8ee', border:'1px solid #ffe0a0', borderRadius:6, padding:'8px 12px' }}>
                                        ⚠ These are sensitive credentials. Never share them. Secret keys are partially masked — edit via the server <code>.env</code> file.
                                    </p>
                                    {[
                                        { label:'Stripe Publishable Key', value: settings.stripePublishableKeyEnv || settings.stripePublishableKey || '(not set)', icon:'💳', alwaysShow: true },
                                        { label:'Stripe Secret Key',       value: settings.stripeSecretKeyMasked || '(not configured)',          icon:'🔐', alwaysShow: false },
                                        { label:'JWT Secret',              value: settings.jwtSecretMasked || '(not configured)',                 icon:'🔑', alwaysShow: false },
                                        { label:'MongoDB URI',             value: settings.mongoUri || '(not available)',                         icon:'🍃', alwaysShow: false },
                                    ].map(k => (
                                        <div key={k.label} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 0', borderBottom:'1px solid #f3f3f3' }}>
                                            <span style={{ fontSize:20 }}>{k.icon}</span>
                                            <div style={{ flex:1 }}>
                                                <div style={{ fontSize:11, color:'#888', fontWeight:500, marginBottom:3 }}>{k.label}</div>
                                                <code style={{ fontSize:12, background:'#f8f8f8', padding:'4px 8px', borderRadius:4, color:'#131921', wordBreak:'break-all', display:'inline-block' }}>
                                                    {(k.alwaysShow || showStripeSecret) ? k.value : '••••••••••••••••••••'}
                                                </code>
                                            </div>
                                        </div>
                                    ))}
                                    <div style={{ marginTop:14, display:'flex', alignItems:'flex-start', gap:8, padding:'10px 14px', background:'#f0f2f5', borderRadius:6 }}>
                                        <span>💡</span>
                                        <span style={{ fontSize:12, color:'#565959' }}>To change API keys, update <code>.env</code> in the <strong>server/</strong> directory and restart the backend server.</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
