import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import api from '../api';

const StarRating = ({ rating }) => (
    <span style={{ color: '#FF9900', fontSize: 14 }}>
        {[1,2,3,4,5].map(i => (
            <AiFillStar key={i} style={{ opacity: i <= Math.round(rating) ? 1 : 0.25 }} />
        ))}
    </span>
);

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ avg: 0, total: 0, breakdown: [0,0,0,0,0] });

    useEffect(() => {
        api.get('/products?limit=50')
            .then(r => setProducts(r.data.products || r.data))
            .catch(() => {});
    }, []);

    useEffect(() => {
        setLoading(true);
        const url = selectedProduct
            ? `/reviews/${selectedProduct}`
            : '/reviews';
        api.get(url)
            .then(r => {
                const data = r.data || [];
                setReviews(data);
                if (data.length) {
                    const avg = data.reduce((s, rv) => s + rv.rating, 0) / data.length;
                    const breakdown = [5,4,3,2,1].map(n => data.filter(rv => Math.round(rv.rating) === n).length);
                    setStats({ avg: avg.toFixed(1), total: data.length, breakdown });
                } else {
                    setStats({ avg: 0, total: 0, breakdown: [0,0,0,0,0] });
                }
            })
            .catch(() => setReviews([]))
            .finally(() => setLoading(false));
    }, [selectedProduct]);

    const sorted = [...reviews].sort((a, b) => {
        if (sortBy === 'highest') return b.rating - a.rating;
        if (sortBy === 'lowest') return a.rating - b.rating;
        if (sortBy === 'helpful') return (b.helpful || 0) - (a.helpful || 0);
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return (
        <div style={{ background: '#f3f3f3', minHeight: '100vh' }}>
            {/* Hero */}
            <div style={{ background: '#131921', color: '#fff', padding: '40px 20px', textAlign: 'center' }}>
                <h1 style={{ fontSize: 32, fontWeight: 300, marginBottom: 8 }}>Customer Reviews</h1>
                <p style={{ color: '#aaa', fontWeight: 300 }}>Honest reviews from verified buyers across India</p>
            </div>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
                {/* Stats + Filter row */}
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
                    {/* Rating stats */}
                    <div style={{ background: '#fff', borderRadius: 4, padding: '20px 28px', border: '1px solid #ddd', minWidth: 200 }}>
                        <div style={{ fontSize: 48, fontWeight: 300, color: '#0f1111', lineHeight: 1 }}>{stats.avg || '—'}</div>
                        <StarRating rating={stats.avg} />
                        <div style={{ fontSize: 13, color: '#565959', marginTop: 6, fontWeight: 300 }}>{stats.total} reviews</div>
                        <div style={{ marginTop: 12 }}>
                            {[5,4,3,2,1].map((n, i) => (
                                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <span style={{ fontSize: 12, color: '#007185', width: 30, fontWeight: 300 }}>{n} star</span>
                                    <div style={{ flex: 1, height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{ width: stats.total ? `${(stats.breakdown[i] / stats.total) * 100}%` : '0%', height: '100%', background: '#FF9900', borderRadius: 4 }} />
                                    </div>
                                    <span style={{ fontSize: 12, color: '#565959', width: 24 }}>{stats.breakdown[i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filters */}
                    <div style={{ background: '#fff', borderRadius: 4, padding: '20px', border: '1px solid #ddd', flex: 1, minWidth: 260 }}>
                        <h3 style={{ fontWeight: 400, marginBottom: 16, fontSize: 16 }}>Filter Reviews</h3>
                        <div className="form-group">
                            <label style={{ fontWeight: 300, fontSize: 13 }}>Filter by Product</label>
                            <select className="form-control" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} style={{ fontSize: 13 }}>
                                <option value="">All Products</option>
                                {products.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={{ marginTop: 12 }}>
                            <label style={{ fontWeight: 300, fontSize: 13 }}>Sort By</label>
                            <select className="form-control" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ fontSize: 13 }}>
                                <option value="newest">Most Recent</option>
                                <option value="highest">Highest Rated</option>
                                <option value="lowest">Lowest Rated</option>
                                <option value="helpful">Most Helpful</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Review List */}
                <div style={{ background: '#fff', borderRadius: 4, border: '1px solid #ddd', padding: '20px 24px' }}>
                    <h2 style={{ fontWeight: 400, fontSize: 20, marginBottom: 20, borderBottom: '1px solid #eee', paddingBottom: 14 }}>
                        {stats.total} Reviews {selectedProduct ? 'for this product' : 'across all products'}
                    </h2>

                    {loading && (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <div className="loader" style={{ margin: '0 auto' }} />
                        </div>
                    )}

                    {!loading && sorted.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#565959' }}>
                            <FiStar size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
                            <p>No reviews found. Be the first to leave a review!</p>
                            <Link to="/" className="btn btn-orange" style={{ display: 'inline-block', marginTop: 12, textDecoration: 'none' }}>Shop Now</Link>
                        </div>
                    )}

                    {sorted.map(review => (
                        <div key={review._id} style={{ padding: '20px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#131921', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, fontSize: 14, flexShrink: 0 }}>
                                    {(review.user?.name || 'A')[0].toUpperCase()}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: 400, fontSize: 14 }}>{review.user?.name || 'Anonymous'}</span>
                                        <StarRating rating={review.rating} />
                                        {review.verified && <span style={{ fontSize: 11, color: '#c45500', background: '#fef3e2', padding: '2px 6px', borderRadius: 3 }}>✓ Verified Purchase</span>}
                                    </div>
                                    <div style={{ fontWeight: 500, marginTop: 6, fontSize: 15 }}>{review.title}</div>
                                    <div style={{ fontSize: 12, color: '#767676', margin: '4px 0 8px', fontWeight: 300 }}>
                                        Reviewed on {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        {review.product?.name && <> · <Link to={`/product/${review.product._id}`} style={{ color: '#007185' }}>{review.product.name}</Link></>}
                                    </div>
                                    <p style={{ fontSize: 14, lineHeight: 1.7, fontWeight: 300, color: '#0f1111', margin: 0 }}>{review.comment}</p>
                                    <div style={{ marginTop: 10, fontSize: 12, color: '#565959' }}>
                                        {review.helpful > 0 && <span>{review.helpful} {review.helpful === 1 ? 'person' : 'people'} found this helpful</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
