import React, { useEffect, useState } from 'react'
import { getProducts, createOrder, createMessage } from './api'

function ProductDetail({ product, onBack, onAdd }) {
  const [mainImg, setMainImg] = useState(product.images[0]);
  const [qty, setQty] = useState(1);
  
  useEffect(() => {
    setMainImg(product.images[0]);
    setQty(1);
  }, [product]);

  return (
    <div className="container mt-8 animate-fade-up" style={{paddingBottom: '6rem'}}>
      <button onClick={onBack} className="btn btn-outline" style={{marginBottom: '2rem', padding: '0.5rem 1rem', fontSize: '0.9rem'}}>← Back</button>
      <div className="grid grid-cols-2" style={{alignItems: 'flex-start', gap: '4rem'}}>
        <div>
          <div style={{borderRadius: 'var(--radius-sm)', overflow: 'hidden', height: '550px', backgroundColor: 'var(--bg-surface)'}}>
            <img src={mainImg} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover', filter: product.filter || 'none'}} />
          </div>
          <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
            {product.images.map((img, i) => (
              <div 
                key={i} 
                onClick={() => setMainImg(img)} 
                style={{
                  width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', cursor: 'pointer', 
                  border: mainImg === img ? '2px solid var(--text-main)' : '2px solid transparent', 
                  opacity: mainImg === img ? 1 : 0.6,
                  transition: 'all 0.2s ease'
                }}
              >
                <img src={img} alt={`angle ${i}`} style={{width: '100%', height: '100%', objectFit: 'cover', filter: product.filter || 'none'}} />
              </div>
            ))}
          </div>
        </div>
        <div className="animate-fade-left delay-200">
          <div className="stars" style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>★★★★★ <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>(24 Reviews)</span></div>
          <h1 style={{fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2}}>{product.name}</h1>
          <div style={{fontSize: '2rem', fontWeight: 700, color: '#ef4444', marginBottom: '1.5rem'}}>
            <del style={{color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 500, marginRight: '1rem'}}>₹{(product.price * 1.2).toLocaleString()}</del>
            ₹{product.price.toLocaleString()}
          </div>
          <p className="text-muted" style={{fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.8}}>{product.desc}</p>
          
          <h3 style={{fontSize: '1rem', marginBottom: '1rem', fontWeight: 700, textTransform: 'uppercase'}}>Key Features:</h3>
          <ul style={{listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '3rem', fontSize: '0.95rem', color: 'var(--text-muted)'}}>
             <li>• Premium Grade T304 Stainless Steel</li>
             <li>• Multi-stage Hand Polished Mirror Finish</li>
             <li>• Seamless TIG Micro-Welding</li>
             <li>• Anti-Corrosion Lifetime Warranty</li>
          </ul>

          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden'}}>
               <button onClick={() => setQty(Math.max(1, qty-1))} style={{padding: '1rem 1.25rem', fontSize: '1.2rem', background: 'var(--bg-surface)'}}>-</button>
               <span style={{fontWeight: 600, padding: '0 1.5rem', fontSize: '1.1rem'}}>{qty}</span>
               <button onClick={() => setQty(qty+1)} style={{padding: '1rem 1.25rem', fontSize: '1.2rem', background: 'var(--bg-surface)'}}>+</button>
            </div>
            <button onClick={() => { onAdd(product, qty); alert('Added to cart!'); }} className="btn btn-primary" style={{flexGrow: 1, padding: '1.15rem', fontSize: '1rem', width: '100%'}}>
               Add to Cart
            </button>
          </div>
          
          <div style={{marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <p>🚚 Free Standard Shipping on all orders</p>
            <p>🛡️ Secure 256-bit SSL encrypted checkout</p>
            <p>↩️ 30-Day hassle free returns</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function App(){
  const [view, setView] = useState('home')
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('sc_cart') || '[]'))
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' })
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [animate, setAnimate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [trendingIndex, setTrendingIndex] = useState(0);

  useEffect(() => {
    if (view === 'home' && products.length > 0) {
      const interval = setInterval(() => {
        setTrendingIndex(prev => (prev + 1) % Math.max(1, products.length - 3));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [view, products]);

  const heroTexts = [
    "Premium Steel.\nEndless Elegance.",
    "Royal Rajwadi.\nMaster Crafted.",
    "Unmatched Durability.\nModern Design.",
    "Luxury Living.\nRedefined."
  ];
  const [heroTextIdx, setHeroTextIdx] = useState(0);

  useEffect(() => { load() }, [])
  
  useEffect(() => {
    setAnimate(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setAnimate(true), 50);
  }, [view]);

  useEffect(() => {
    if (view === 'home') {
      const interval = setInterval(() => {
        setHeroTextIdx(prev => (prev + 1) % heroTexts.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [view]);

  async function load() { 
    try {
      const p = await getProducts(); 
      if(p && p.length > 0) {
        setProducts(p.map(prod => ({
          ...prod,
          images: [prod.img, '/images/detail1.jpg', '/images/detail2.jpg']
        }))); 
      } else { throw new Error("No products"); }
    } catch(err) {
      const mock = [
        { _id: '1', name: 'Royal Rajwadi Jhula', category: 'Swings', price: 65000, img: '/images/product1.jpg', desc: 'A majestic Rajwadi style stainless steel canopy swing with intricate laser-cut designs and plush velvet seating.' },
        { _id: '2', name: 'Premium Indoor Jhula', category: 'Swings', price: 38000, img: '/images/product7.jpg', desc: 'Traditional aesthetics meet modern engineering. This indoor swing features plush custom cushioning.' },
        { _id: '3', name: 'Luxury Steel Main Door', category: 'Doors', price: 55000, img: '/images/product6.jpg', desc: 'Make a grand entrance with this highly secure, polished steel main door.' },
        { _id: '4', name: 'Glass & Steel Staircase', category: 'Railings', price: 28000, img: '/images/product8.jpg', desc: 'Transform your home with our floating-effect staircase railing.' },
        { _id: '5', name: 'Balcony Steel Frame', category: 'Railings', price: 22000, img: '/images/product9.jpg', desc: 'A heavy-duty balcony railing system designed for maximum safety.' },
        { _id: '6', name: 'Luxury Glass Dining', category: 'Furniture', price: 35000, img: '/images/product3.jpg', desc: 'An ultra-modern dining table featuring a sculptural stainless steel base.' },
        { _id: '7', name: 'Modern Steel Bench', category: 'Furniture', price: 12000, img: '/images/product2.jpg', desc: 'A versatile, minimalist bench that works beautifully in gardens or hallways.' },
        { _id: '8', name: 'Minimal Planter Stand', category: 'Decor', price: 4500, img: '/images/product4.jpg', desc: 'Elevate your indoor greenery with this multi-tier planter stand.' },
        { _id: '9', name: 'Geometric Wall Art', category: 'Decor', price: 8500, img: '/images/steel_wall_art_1777091434836.png', desc: 'A breathtaking 3D wall art piece laser cut from solid steel.' },
        { _id: '10', name: 'Golden Finish Center Table', category: 'Furniture', price: 18000, img: '/images/steel_table_1777060151161.png', desc: 'PVD gold coated stainless steel center table with tempered glass top.' },
        { _id: '11', name: 'Classic Steel Wardrobe', category: 'Furniture', price: 42000, img: '/images/steel_wardrobe_1777060165297.png', desc: 'Durable, anti-rust stainless steel wardrobe with sliding doors.' },
        { _id: '12', name: 'Designer Safety Door', category: 'Doors', price: 48000, img: '/images/steel_safety_door_1777060181338.png', desc: 'Laser cut designer safety door with mosquito mesh.' },
        { _id: '13', name: 'Outdoor Garden Swing', category: 'Swings', price: 32000, img: '/images/steel_garden_swing_1777060198147.png', desc: 'Weather-resistant outdoor swing with canopy.' },
        { _id: '14', name: 'Spiral Steel Staircase', category: 'Railings', price: 85000, img: '/images/steel_spiral_staircase_1777060215051.png', desc: 'Space-saving spiral staircase made of SS 304 grade steel.' },
        { _id: '15', name: 'Steel Bed Frame', category: 'Furniture', price: 26000, img: '/images/steel_bed_frame_1777060231182.png', desc: 'King size stainless steel bed frame with modern headboard.' },
        { _id: '16', name: 'Bronze Finish Royal Jhula', category: 'Swings', price: 75000, img: '/images/bronze_jhula_1777091455416.png', desc: 'Exclusive bronze-tinted stainless steel jhula for a highly royal aesthetic.' },
        { _id: '17', name: 'Rose Gold Indoor Swing', category: 'Swings', price: 41000, img: '/images/rosegold_swing_1777091473029.png', desc: 'Trendy rose gold PVD coated indoor swing for modern living rooms.' },
        { _id: '18', name: 'Matte Black Main Door', category: 'Doors', price: 58000, img: '/images/black_steel_door_1777091491670.png', desc: 'Matte black powder-coated steel security door for a stealthy look.' },
        { _id: '19', name: 'Copper Tone Staircase', category: 'Railings', price: 32000, img: '/images/copper_staircase_1777091511145.png', desc: 'Warm copper-finished steel staircase railing.' },
        { _id: '20', name: 'Silver Glass Dining Table', category: 'Furniture', price: 31000, img: '/images/silver_dining_table_1777091535026.png', desc: 'Sleek silver polished stainless steel dining table.' },
        { _id: '21', name: 'Dark Steel Wardrobe', category: 'Furniture', price: 46000, img: '/images/dark_wardrobe_1777091555148.png', desc: 'Industrial style darkened steel wardrobe.' },
        { _id: '22', name: 'Brass Finish Safety Door', category: 'Doors', price: 51000, img: '/images/brass_door_1777091573595.png', desc: 'Elegant brass-finished steel safety door.' },
        { _id: '23', name: 'White Steel Garden Swing', category: 'Swings', price: 34000, img: '/images/white_swing_1777091589314.png', desc: 'Bright white powder-coated outdoor steel swing.' },
        { _id: '24', name: 'Industrial Spiral Staircase', category: 'Railings', price: 82000, img: '/images/industrial_staircase_1777091605264.png', desc: 'Raw industrial steel finish spiral staircase.' }
      ];
      setProducts(mock.map(p => ({...p, images: [p.img, '/images/detail1.jpg', '/images/detail2.jpg']})));
    }
  }

  useEffect(() => localStorage.setItem('sc_cart', JSON.stringify(cart)), [cart])

  function addToCart(prod, qty=1) {
    const it = cart.find(i => i.id === prod._id)
    if(it) setCart(cart.map(c => c.id === it.id ? { ...c, qty: c.qty + qty } : c))
    else setCart([...cart, { id: prod._id, name: prod.name, price: prod.price, img: prod.images ? prod.images[0] : prod.img, qty, filter: prod.filter }])
  }

  function decrementCart(id) {
    const it = cart.find(i => i.id === id)
    if(it && it.qty > 1) setCart(cart.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c))
    else deleteFromCart(id)
  }

  function deleteFromCart(id) { setCart(cart.filter(c => c.id !== id)) }

  function openProduct(p) {
    setSelectedProduct(p);
    setView('product');
  }

  const categories = ['All', 'Swings', 'Doors', 'Railings', 'Furniture', 'Decor'];
  const filteredProducts = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);
  const cartCount = cart.reduce((s,i) => s + i.qty, 0);

  return (
    <div className="app-container">
      {/* E-commerce Top Utility Bar */}
      <div className="top-bar">
        FREE Nationwide Shipping on Orders over ₹50,000 | Contact Us: +91 98765 43210
      </div>

      {/* Modern Navbar */}
      <header className="navbar">
        <div className="container">
          <div className="brand" onClick={() => setView('home')} style={{cursor: 'pointer'}}>
            <span style={{fontSize: '1.8rem'}}>SC</span> <span style={{fontWeight: 300}}>SteelCraft</span>
          </div>
          
          <nav className="nav-links">
            <button className={`nav-link ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>Home</button>
            <button className={`nav-link ${view === 'shop' ? 'active' : ''}`} onClick={() => setView('shop')}>Shop</button>
            <button className={`nav-link ${view === 'contact' ? 'active' : ''}`} onClick={() => setView('contact')}>Contact</button>
          </nav>

          <div className="nav-icons">
            <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                style={{padding: '0.5rem 2.5rem 0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--border)', outline: 'none', width: '220px', fontSize: '0.9rem'}}
              />
              <span style={{position: 'absolute', right: '12px', color: 'var(--text-muted)'}}>🔍</span>
              {showSuggestions && searchQuery && (
                <div style={{position: 'absolute', top: '100%', right: 0, width: '300px', background: 'white', boxShadow: 'var(--shadow-lg)', borderRadius: 'var(--radius-sm)', zIndex: 100, marginTop: '0.5rem', maxHeight: '400px', overflowY: 'auto', border: '1px solid var(--border)'}}>
                  {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <div style={{padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem'}}>No products found</div>
                  )}
                  {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8).map(p => (
                    <div key={p._id} onClick={() => openProduct(p)} style={{padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background 0.2s'}} className="hover-bg-surface">
                       <img src={p.images[0]} style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', filter: p.filter || 'none'}} />
                       <div>
                         <div style={{fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem'}}>{p.name}</div>
                         <div style={{fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700}}>₹{p.price.toLocaleString()}</div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="nav-icon-btn" onClick={() => setView('auth')}>👤</button>
            <button className="nav-icon-btn" onClick={() => setView('cart')}>
              🛒 
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <main style={{ flexGrow: 1 }}>
        {view === 'home' && (
          <div className={animate ? "animate-fade-up" : ""} style={{opacity: animate ? 1 : 0}}>
            
            {/* Hero Section with Video */}
            <section style={{position: 'relative', height: '75vh', minHeight: '600px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <video autoPlay loop muted playsInline style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -2}}>
                <source src="/images/bg_video.mp4" type="video/mp4" />
              </video>
              <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.65)', zIndex: -1}}></div>
              
              <div className="container text-center" style={{color: 'white', zIndex: 1}}>
                <h1 key={heroTextIdx} className="cinematic-text" style={{fontSize: '5rem', fontWeight: 800, marginBottom: '1rem', textShadow: '0 4px 12px rgba(0,0,0,0.5)', color: 'white', lineHeight: 1.1, whiteSpace: 'pre-line'}}>
                  {heroTexts[heroTextIdx]}
                </h1>
                <p className="animate-fade-up delay-200" style={{fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 3rem', color: '#f1f5f9'}}>
                  Explore the finest collection of luxury stainless steel furniture and architectural elements. Unmatched durability meets modern design.
                </p>
                <button className="btn btn-primary animate-scale delay-300" onClick={() => setView('shop')} style={{padding: '1rem 3rem', fontSize: '1.1rem'}}>Shop Collection</button>
              </div>
            </section>

            {/* Trust Bar */}
            <div className="trust-bar animate-fade-up delay-400">
              <div className="trust-item"><span className="trust-icon">🚚</span><div><div className="trust-title">Free Shipping</div><div className="trust-desc">All over India</div></div></div>
              <div className="trust-item"><span className="trust-icon">🛡️</span><div><div className="trust-title">Lifetime Warranty</div><div className="trust-desc">Anti-Rust Guarantee</div></div></div>
              <div className="trust-item"><span className="trust-icon">🔒</span><div><div className="trust-title">Secure Payments</div><div className="trust-desc">100% Safe Checkout</div></div></div>
              <div className="trust-item"><span className="trust-icon">⭐</span><div><div className="trust-title">Top Rated</div><div className="trust-desc">5-Star Quality</div></div></div>
            </div>

            {/* Category Circles */}
            <div className="category-circles animate-fade-up delay-400">
               {[
                 {name: 'Swings', img: '/images/product1.jpg'},
                 {name: 'Main Doors', img: '/images/product6.jpg'},
                 {name: 'Furniture', img: '/images/product3.jpg'},
                 {name: 'Railings', img: '/images/product8.jpg'},
                 {name: 'Home Decor', img: '/images/product4.jpg'}
               ].map((cat, i) => (
                 <div key={i} className="cat-circle" onClick={() => { setActiveCategory(cat.name === 'Main Doors' ? 'Doors' : cat.name === 'Home Decor' ? 'Decor' : cat.name); setView('shop'); }}>
                   <div className="cat-circle-img"><img src={cat.img} alt={cat.name} /></div>
                   <span>{cat.name}</span>
                 </div>
               ))}
            </div>

            {/* Featured Products Collection */}
            <section className="container mt-8 animate-fade-up delay-500" style={{padding: '6rem 0'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem'}}>
                <div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>Trending Now</h2>
                  <p className="text-muted" style={{marginTop: '0.5rem'}}>Best sellers this month.</p>
                </div>
                <button className="btn btn-outline" onClick={() => setView('shop')}>View All →</button>
              </div>

              <div className="grid grid-cols-4" style={{transition: 'opacity 0.3s ease'}}>
                {products.slice(trendingIndex, trendingIndex + 4).map((p, idx) => (
                  <div key={p._id} className="card" style={{ animation: `fadeInUp 0.5s ease forwards` }}>
                    <div className="card-badge">Sale</div>
                    <div className="card-img-wrap" onClick={() => openProduct(p)} style={{cursor: 'pointer'}}>
                      <img src={p.images[0]} alt={p.name} className="card-img" style={{filter: p.filter || 'none'}} />
                      <div className="card-action">
                        <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); addToCart(p); }} style={{width: '100%', fontSize: '0.85rem', padding: '0.5rem'}}>Quick Add</button>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="stars">★★★★★</div>
                      <h3 className="card-title" onClick={() => openProduct(p)} style={{cursor: 'pointer'}}>{p.name}</h3>
                      <div className="card-price"><del>₹{(p.price * 1.2).toLocaleString()}</del> ₹{p.price.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Features/Process Section */}
            <section className="container mt-8 animate-fade-up delay-600" style={{padding: '4rem 2rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', marginBottom: '4rem'}}>
              <div style={{textAlign: 'center', marginBottom: '3rem'}}>
                <h2 style={{fontSize: '2.5rem', fontWeight: 800}}>The SteelCraft Advantage</h2>
                <p className="text-muted" style={{marginTop: '0.5rem'}}>Why we are the leading choice for premium steel furniture</p>
              </div>
              <div className="grid grid-cols-3 text-center" style={{gap: '2rem'}}>
                <div style={{padding: '1rem'}}>
                  <div style={{fontSize: '3rem', marginBottom: '1rem'}}>✨</div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem'}}>SS 304 & 316 Grade</h3>
                  <p className="text-muted" style={{fontSize: '0.9rem', lineHeight: 1.6}}>We only use the highest quality marine and food-grade stainless steel for maximum longevity.</p>
                </div>
                <div style={{padding: '1rem'}}>
                  <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🎨</div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem'}}>PVD Coating</h3>
                  <p className="text-muted" style={{fontSize: '0.9rem', lineHeight: 1.6}}>Advanced Physical Vapor Deposition gives our steel stunning gold, rose gold, and black finishes.</p>
                </div>
                <div style={{padding: '1rem'}}>
                  <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🛠️</div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem'}}>Laser Precision</h3>
                  <p className="text-muted" style={{fontSize: '0.9rem', lineHeight: 1.6}}>State-of-the-art CNC laser cutting ensures flawless geometric patterns on all our doors and decor.</p>
                </div>
              </div>
            </section>
            
            {/* Newsletter Section */}
            <section className="newsletter">
              <div className="container">
                <h2 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '1rem'}}>Join the SteelCraft Club</h2>
                <p className="text-muted" style={{marginBottom: '2rem'}}>Subscribe to receive exclusive offers, new product alerts, and 10% off your first order.</p>
                <form style={{display: 'flex', justifyContent: 'center'}} onSubmit={(e) => {e.preventDefault(); alert('Subscribed!')}}>
                  <input type="email" placeholder="Enter your email address" required />
                  <button type="submit">Subscribe</button>
                </form>
              </div>
            </section>
          </div>
        )}

        {view === 'shop' && (
          <div className={`container mt-8 ${animate ? 'animate-fade-up' : ''}`} style={{opacity: animate ? 1 : 0, paddingBottom: '6rem'}}>
            <div className="mb-8 text-center animate-fade-up">
              <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>All Products</h1>
              <p className="text-muted" style={{ fontSize: '1rem', marginBottom: '2rem' }}>Showing {filteredProducts.length} results</p>
              
              <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem'}}>
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                    style={{padding: '0.5rem 1rem', fontSize: '0.85rem'}}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4">
              {filteredProducts.map((p, idx) => (
                <div key={p._id} className="card" style={{ animation: animate ? `fadeInUp 0.6s ease ${idx * 0.1}s forwards` : 'none', opacity: 0 }}>
                  <div className="card-img-wrap" onClick={() => openProduct(p)} style={{cursor: 'pointer'}}>
                    <img src={p.images[0]} alt={p.name} className="card-img" style={{filter: p.filter || 'none'}} />
                    <div className="card-action">
                      <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); addToCart(p); }} style={{width: '100%', fontSize: '0.85rem', padding: '0.5rem'}}>Quick Add</button>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="stars">★★★★★</div>
                    <h3 className="card-title" onClick={() => openProduct(p)} style={{cursor: 'pointer'}}>{p.name}</h3>
                    <div className="card-price">₹{p.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'product' && selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            onBack={() => setView('shop')}
            onAdd={addToCart}
          />
        )}

        {view === 'cart' && (
          <div className={`container mt-8 ${animate ? 'animate-scale' : ''}`} style={{ maxWidth: '1000px', margin: '2rem auto', opacity: animate ? 1 : 0, paddingBottom: '6rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Shopping Bag ({cartCount})</h1>
            
            {cart.length === 0 ? (
              <div className="text-center animate-fade-up delay-100" style={{padding: '4rem 0'}}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.2 }}>🛍️</div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Your bag is empty</h3>
                <p className="text-muted" style={{marginBottom: '2rem'}}>Looks like you haven't added anything to your cart yet.</p>
                <button className="btn btn-primary" onClick={() => setView('shop')} style={{padding: '1rem 3rem'}}>Start Shopping</button>
              </div>
            ) : (
              <div className="grid grid-cols-2" style={{ alignItems: 'flex-start', gridTemplateColumns: '1.3fr 0.7fr', gap: '3rem' }}>
                <div className="animate-fade-left delay-100">
                  <div style={{ marginBottom: '2rem' }}>
                    {cart.map(c => (
                      <div key={c.id} style={{display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem 0', borderBottom: '1px solid var(--border)'}}>
                        <img src={c.img} alt={c.name} style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', filter: c.filter || 'none'}} />
                        <div style={{flexGrow: 1}}>
                          <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{c.name}</div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>₹{c.price.toLocaleString()}</div>
                          
                          <div style={{display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden', width: 'fit-content'}}>
                            <button onClick={() => decrementCart(c.id)} style={{padding: '0.25rem 0.75rem', background: 'var(--bg-surface)'}}>-</button>
                            <span style={{padding: '0.25rem 0.75rem', fontWeight: 600, minWidth: '40px', textAlign: 'center', fontSize: '0.9rem'}}>{c.qty}</span>
                            <button onClick={() => addToCart({_id: c.id})} style={{padding: '0.25rem 0.75rem', background: 'var(--bg-surface)'}}>+</button>
                          </div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100px'}}>
                          <div style={{fontWeight: 800, fontSize: '1.1rem'}}>₹{(c.price * c.qty).toLocaleString()}</div>
                          <button onClick={() => deleteFromCart(c.id)} style={{color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'underline'}}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="animate-fade-right delay-200" style={{position: 'sticky', top: '100px', background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-md)'}}>
                  <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Order Summary</h3>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)'}}>
                     <span>Subtotal</span>
                     <span>₹{cart.reduce((s,i) => s + i.price * i.qty, 0).toLocaleString()}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)'}}>
                     <span>Shipping</span>
                     <span style={{color: '#22c55e', fontWeight: 600}}>Free</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem', fontSize: '1.5rem', fontWeight: 800 }}>
                    <span>Total</span>
                    <span>₹{cart.reduce((s,i) => s + i.price * i.qty, 0).toLocaleString()}</span>
                  </div>
                  
                  <button onClick={() => { alert('Proceeding to secure checkout...'); setCart([]); setView('home'); }} className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1.1rem' }}>
                    Checkout Securely
                  </button>
                  <div style={{marginTop: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', opacity: 0.5}}>
                    <span style={{fontSize: '1.5rem'}}>💳</span>
                    <span style={{fontSize: '1.5rem'}}>🏦</span>
                    <span style={{fontSize: '1.5rem'}}>🔒</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'contact' && (
          <div className={`container mt-8 ${animate ? 'animate-fade-up' : ''}`} style={{ maxWidth: '900px', margin: '2rem auto', opacity: animate ? 1 : 0, paddingBottom: '6rem' }}>
            <div className="grid grid-cols-2" style={{border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'white', boxShadow: 'var(--shadow-lg)', overflow: 'hidden'}}>
              <div style={{background: '#0f172a', color: 'white', padding: '3rem'}}>
                <h2 style={{fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem'}}>Get in Touch</h2>
                <p style={{color: '#94a3b8', marginBottom: '3rem', fontSize: '1.1rem'}}>Have a question about our products or want a custom design? We'd love to hear from you.</p>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                  <div style={{display: 'flex', alignItems: 'flex-start', gap: '1rem'}}>
                    <span style={{fontSize: '1.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '50%'}}>📍</span>
                    <div>
                      <h4 style={{fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem'}}>Our Showroom</h4>
                      <p style={{color: '#94a3b8', fontSize: '0.95rem'}}>123 SteelCraft Avenue, Industrial Estate, Mumbai, India</p>
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'flex-start', gap: '1rem'}}>
                    <span style={{fontSize: '1.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '50%'}}>📞</span>
                    <div>
                      <h4 style={{fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem'}}>Phone Number</h4>
                      <p style={{color: '#94a3b8', fontSize: '0.95rem'}}>+91 98765 43210</p>
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'flex-start', gap: '1rem'}}>
                    <span style={{fontSize: '1.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '50%'}}>✉️</span>
                    <div>
                      <h4 style={{fontWeight: 600, marginBottom: '0.2rem', fontSize: '1.1rem'}}>Email Address</h4>
                      <p style={{color: '#94a3b8', fontSize: '0.95rem'}}>hello@steelcraft.com</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{padding: '3rem'}}>
                <h3 style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem'}}>Send a Message</h3>
                <form onSubmit={(e) => { e.preventDefault(); alert('Message Sent!'); setView('home'); }}>
                  <div className="input-group" style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem'}}>Full Name</label>
                    <input type="text" className="input" required placeholder="John Doe" style={{width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'}} />
                  </div>
                  <div className="input-group" style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem'}}>Email Address</label>
                    <input type="email" className="input" required placeholder="john@example.com" style={{width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'}} />
                  </div>
                  <div className="input-group" style={{marginBottom: '1.5rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem'}}>Message</label>
                    <textarea className="input" rows="4" required placeholder="How can we help you?" style={{width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', resize: 'vertical'}}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {view === 'auth' && (
          <div className={`container mt-8 ${animate ? 'animate-fade-up' : ''}`} style={{ maxWidth: '450px', margin: '4rem auto', opacity: animate ? 1 : 0, paddingBottom: '6rem' }}>
            <div style={{padding: '3rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'white', boxShadow: 'var(--shadow-lg)'}}>
              <div className="text-center mb-6">
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome Back</h1>
                <p className="text-muted">Sign in to your SteelCraft account</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); alert('Logged in successfully!'); setView('home'); }}>
                <div className="input-group" style={{marginBottom: '1rem'}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem'}}>Email</label>
                  <input type="email" className="input" required placeholder="john@example.com" style={{width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'}} />
                </div>
                <div className="input-group" style={{marginBottom: '1.5rem'}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem'}}>Password</label>
                  <input type="password" className="input" required placeholder="••••••••" style={{width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'}} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                  Sign In
                </button>
              </form>
              
              <div style={{display: 'flex', alignItems: 'center', margin: '1.5rem 0'}}>
                <div style={{flexGrow: 1, height: '1px', background: 'var(--border)'}}></div>
                <span style={{padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.85rem'}}>OR CONTINUE WITH</span>
                <div style={{flexGrow: 1, height: '1px', background: 'var(--border)'}}></div>
              </div>
              
              <div style={{display: 'flex', gap: '1rem'}}>
                <button className="btn btn-outline" style={{flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center'}} onClick={() => alert('Google login triggered')}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{width: '20px'}} /> Google
                </button>
                <button className="btn btn-outline" style={{flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center'}} onClick={() => alert('Facebook login triggered')}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" style={{width: '20px'}} /> Facebook
                </button>
              </div>
              
              <p style={{textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)'}}>
                Don't have an account? <span style={{color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline'}}>Sign Up</span>
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{backgroundColor: '#0f172a', color: '#94a3b8', padding: '5rem 0 2rem', marginTop: 'auto'}}>
        <div className="container grid grid-cols-4" style={{marginBottom: '4rem'}}>
          <div style={{gridColumn: 'span 2'}}>
            <h3 style={{color: 'white', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800}}>SteelCraft.</h3>
            <p style={{maxWidth: '350px', marginBottom: '2rem'}}>The ultimate destination for premium stainless steel furniture. Experience flawless craftsmanship and timeless design.</p>
            <div style={{display: 'flex', gap: '1rem'}}>
               <span style={{width: '40px', height: '40px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>f</span>
               <span style={{width: '40px', height: '40px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>ig</span>
               <span style={{width: '40px', height: '40px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>in</span>
            </div>
          </div>
          <div>
            <h3 style={{color: 'white', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600}}>Shop</h3>
            <ul style={{listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              <li><a href="#" style={{color: 'inherit'}}>All Products</a></li>
              <li><a href="#" style={{color: 'inherit'}}>Best Sellers</a></li>
              <li><a href="#" style={{color: 'inherit'}}>New Arrivals</a></li>
              <li><a href="#" style={{color: 'inherit'}}>Discount Items</a></li>
            </ul>
          </div>
          <div>
            <h3 style={{color: 'white', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600}}>Customer Care</h3>
            <ul style={{listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              <li><a href="#" style={{color: 'inherit'}}>Contact Us</a></li>
              <li><a href="#" style={{color: 'inherit'}}>Shipping Policy</a></li>
              <li><a href="#" style={{color: 'inherit'}}>Returns & Refunds</a></li>
              <li><a href="#" style={{color: 'inherit'}}>FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="container" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1e293b', paddingTop: '2rem', fontSize: '0.9rem'}}>
          <div>&copy; {new Date().getFullYear()} SteelCraft. All rights reserved.</div>
          <div style={{display: 'flex', gap: '0.75rem', fontSize: '1.5rem', opacity: 0.8}}>
            <span>💳</span>
            <span>🏦</span>
            <span>💵</span>
            <span>🔒</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App