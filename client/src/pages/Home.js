import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import Slider from 'react-slick';
import { FiChevronRight, FiZap } from 'react-icons/fi';

const HERO_SLIDES = [
    {
        bg: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80',
        title: 'Premium Electronics',
        sub: 'Discover the latest gadgets & tech.',
        btn: 'Shop Electronics',
        cat: 'Electronics',
    },
    {
        bg: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
        title: 'Exclusive Fashion',
        sub: 'Upgrade your wardrobe with new arrivals.',
        btn: 'Shop Fashion',
        cat: 'Clothing',
    },
    {
        bg: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80',
        title: 'Home Essentials',
        sub: 'Furnish your space with style.',
        btn: 'Shop Home',
        cat: 'Home',
    },
];

const CATEGORY_BANNERS = [
    { name: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', color: '#232F3E' },
    { name: 'Clothing', img: 'https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=400', color: '#37475A' },
    { name: 'Books', img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', color: '#131921' },
    { name: 'Sports', img: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=400', color: '#1a2533' },
    { name: 'Home', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', color: '#2d3e50' },
    { name: 'Beauty', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', color: '#3d2b2b' },
];

const Home = () => {
    const [filter, setFilter] = useState('All');
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('search');
    const categoryParam = searchParams.get('category');

    const { products, featured, flashSale, loading, error, fetchProducts } = useProduct();

    useEffect(() => {
        let query = '';
        const cat = categoryParam || filter;
        if (keyword) query = `?search=${keyword}`;
        else if (cat && cat !== 'All') query = `?category=${cat}`;
        fetchProducts(query);
    }, [keyword, filter, categoryParam]); // eslint-disable-line

    useEffect(() => {
        if (categoryParam) setFilter(categoryParam);
    }, [categoryParam]);

    const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];

    const heroSettings = {
        dots: true, infinite: true, speed: 800,
        slidesToShow: 1, slidesToScroll: 1, autoplay: true,
        autoplaySpeed: 5000, pauseOnHover: true,
    };

    const sliderSettings = {
        dots: false, infinite: true, speed: 400,
        slidesToShow: 5, slidesToScroll: 2,
        responsive: [
            { breakpoint: 1400, settings: { slidesToShow: 4 } },
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 2 } },
        ],
    };

    const isFiltering = !!keyword || !!categoryParam;

    return (
        <div style={{ background: '#f3f3f3', minHeight: '100vh' }}>
            {/* ── HERO SLIDER ─────────────────── */}
            {!keyword && (
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <Slider {...heroSettings}>
                        {HERO_SLIDES.map((slide, i) => (
                            <div key={i}>
                                <div style={{
                                    height: 420, minHeight: 280,
                                    backgroundImage: `url(${slide.bg})`,
                                    backgroundSize: 'cover', backgroundPosition: 'center',
                                    position: 'relative',
                                }}>
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'linear-gradient(90deg, rgba(15,17,17,0.75) 40%, transparent)',
                                        display: 'flex', flexDirection: 'column',
                                        justifyContent: 'center', padding: '0 7%',
                                    }}>
                                        <p style={{ color: '#FF9900', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
                                            Best Deals
                                        </p>
                                        <h1 style={{ color: '#fff', fontSize: 40, fontWeight: 200, lineHeight: 1.2, marginBottom: 14, maxWidth: 480 }}>
                                            {slide.title}
                                        </h1>
                                        <p style={{ color: '#ccc', fontSize: 16, fontWeight: 300, marginBottom: 24, maxWidth: 400 }}>
                                            {slide.sub}
                                        </p>
                                        <Link
                                            to={`/?category=${slide.cat}`}
                                            style={{ display: 'inline-block', padding: '12px 28px', background: '#FF9900', borderRadius: 4, color: '#111', fontWeight: 600, fontSize: 15, textDecoration: 'none', width: 'fit-content' }}
                                        >
                                            {slide.btn}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            )}

            <div className="container" style={{ padding: '16px' }}>

                {/* ── CATEGORY GRID ─────────────── */}
                {!keyword && (
                    <div style={{ background: '#fff', borderRadius: 4, padding: '20px 16px', marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                        <div className="section-heading">
                            <span>Shop by Category</span>
                            <span></span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
                            {CATEGORY_BANNERS.map(cat => (
                                <Link key={cat.name} to={`/?category=${cat.name}`}
                                    style={{ textDecoration: 'none', borderRadius: 6, overflow: 'hidden', border: '1px solid #eee', transition: 'transform 0.2s', display: 'block' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <div style={{ position: 'relative', paddingTop: '70%', overflow: 'hidden' }}>
                                        <img src={cat.img} alt={cat.name}
                                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={e => { e.target.style.background = cat.color; }} />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', display: 'flex', alignItems: 'flex-end', padding: '8px 10px' }}>
                                            <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{cat.name}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {/* Mobile: 3-col */}
                        <style>{`@media(max-width:768px){.cat-grid{grid-template-columns:repeat(3,1fr)!important;}}`}</style>
                    </div>
                )}

                {/* ── FLASH SALE ────────────────── */}
                {!keyword && flashSale.length > 0 && (
                    <div style={{ background: '#fff', borderRadius: 4, padding: '20px 16px', marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                        <div className="section-heading">
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiZap style={{ color: '#FF9900' }} size={20} />
                                Flash Sale
                                <span style={{ padding: '3px 10px', background: '#cc0c39', color: '#fff', fontSize: 11, borderRadius: 2, fontWeight: 600 }}>
                                    LIMITED TIME
                                </span>
                            </span>
                            <Link to="/?category=All" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#007185', fontSize: 13 }}>
                                See all <FiChevronRight size={14} />
                            </Link>
                        </div>
                        <Slider {...sliderSettings}>
                            {flashSale.map(product => (
                                <div key={product._id} style={{ padding: '0 6px' }}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}

                {/* ── PROMO BANNER ─────────────── */}
                {!keyword && !categoryParam && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        {[
                            { img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=700&q=80', title: 'Mobile Accessories', sub: 'Up to 60% off', cat: 'Electronics' },
                            { img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=700&q=80', title: 'Sports & Fitness', sub: 'Best in class', cat: 'Sports' },
                        ].map(({ img, title, sub, cat }) => (
                            <Link key={cat} to={`/?category=${cat}`}
                                style={{ borderRadius: 4, overflow: 'hidden', position: 'relative', height: 160, display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textDecoration: 'none' }}>
                                <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 40%, transparent)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 300, marginBottom: 4 }}>{title}</h3>
                                    <p style={{ color: '#FF9900', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{sub}</p>
                                    <span style={{ color: '#fff', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>Shop now <FiChevronRight size={13} /></span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* ── FEATURED PRODUCTS ─────────── */}
                {!keyword && featured.length > 0 && (
                    <div style={{ background: '#fff', borderRadius: 4, padding: '20px 16px', marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                        <div className="section-heading">
                            <span>⭐ Featured Products</span>
                            <Link to="/?sort=rating" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#007185', fontSize: 13, textDecoration: 'none' }}>
                                See all <FiChevronRight size={14} />
                            </Link>
                        </div>
                        <Slider {...sliderSettings}>
                            {featured.map(product => (
                                <div key={product._id} style={{ padding: '0 6px' }}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}

                {/* ── PRODUCT GRID ──────────────── */}
                <div style={{ background: '#fff', borderRadius: 4, padding: '20px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <div className="section-heading" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
                        <span>
                            {keyword ? `Search Results for "${keyword}"` : categoryParam ? `${categoryParam}` : 'All Products'}
                            {!loading && <span style={{ fontSize: 14, color: '#565959', fontWeight: 300, marginLeft: 8 }}>({products.length} results)</span>}
                        </span>

                        {!keyword && (
                            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, width: '100%', scrollbarWidth: 'none' }}>
                                {categories.map(cat => (
                                    <button key={cat} onClick={() => { setFilter(cat); navigate(cat === 'All' ? '/' : `/?category=${cat}`); }}
                                        style={{
                                            padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 300,
                                            whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.15s',
                                            background: (filter === cat || (cat === 'All' && !categoryParam && filter === 'All')) ? '#131921' : '#fff',
                                            color: (filter === cat || (cat === 'All' && !categoryParam && filter === 'All')) ? '#fff' : '#131921',
                                            border: `1px solid ${(filter === cat) ? '#131921' : '#ddd'}`,
                                        }}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="loader" />
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <p style={{ fontSize: 22, fontWeight: 300, color: '#565959', marginBottom: 12 }}>No results found</p>
                            <p style={{ fontSize: 14, color: '#767676' }}>Try adjusting your search or filter to find what you're looking for.</p>
                            <button onClick={() => { setFilter('All'); navigate('/'); }}
                                style={{ marginTop: 20, padding: '10px 24px', background: 'linear-gradient(to bottom, #f7dfa5, #f0c14b)', border: '1px solid #a88734', borderRadius: 4, color: '#111', fontWeight: 500, cursor: 'pointer' }}>
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="product-grid" style={{ paddingTop: 20 }}>
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── TRUST BADGES ─────────────────── */}
            {!keyword && (
                <div style={{ background: '#131921', padding: '32px 0', marginTop: 20 }}>
                    <div className="container">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24, textAlign: 'center' }}>
                            {[
                                { emoji: '🚚', title: 'Free Delivery', sub: 'On orders above ₹499' },
                                { emoji: '🔒', title: 'Secure Payment', sub: '100% secure checkout' },
                                { emoji: '↩️', title: '30-day Returns', sub: 'Easy return policy' },
                                { emoji: '🎧', title: '24/7 Support', sub: 'Round-the-clock help' },
                            ].map(({ emoji, title, sub }) => (
                                <div key={title} style={{ color: '#fff' }}>
                                    <div style={{ fontSize: 28, marginBottom: 8 }}>{emoji}</div>
                                    <h4 style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{title}</h4>
                                    <p style={{ fontSize: 12, color: '#aaa', fontWeight: 300 }}>{sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
