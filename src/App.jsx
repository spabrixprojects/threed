import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Shield, Sparkles, Droplets, MapPin, Phone, Mail, CarFront } from 'lucide-react';
import './App.css';

const ScrollProgressCar = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['20px', 'calc(100vh - 60px)']);
  
  return (
    <>
      <div className="scroll-progress-line" style={{ position: 'fixed', right: '35px', top: 0, height: '100dvh', width: '2px', background: 'rgba(255,255,255,0.05)', zIndex: 9998 }}></div>
      <motion.div
        className="scroll-progress-car"
        style={{
          position: 'fixed',
          right: '20px',
          top: 0,
          y,
          zIndex: 9999,
          color: 'var(--accent-red)',
          filter: 'drop-shadow(0 0 15px rgba(255,0,51,0.8))'
        }}
      >
        <CarFront size={32} style={{ transform: 'rotate(180deg)', display: 'block' }} />
      </motion.div>
    </>
  );
};

// Components
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        AUTO<span>MORPH</span>
      </div>
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
        Book Now
      </button>
    </nav>
  );
};

const Hero = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadedImages = [];
    for (let i = 1; i <= 240; i++) {
      const img = new Image();
      img.src = `/images/ezgif-frame-${String(i).padStart(3, '0')}.png`;
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, 240]);

  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (!canvasRef.current || images.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    let index = Math.floor(latest) - 1;
    index = Math.max(0, Math.min(239, index));
    const img = images[index];

    if (img && img.complete && img.naturalWidth > 0) {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      
      const ratio = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const newWidth = img.naturalWidth * ratio;
      const newHeight = img.naturalHeight * ratio;
      const x = (canvas.width - newWidth) / 2;
      const y = (canvas.height - newHeight) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, newWidth, newHeight);
    }
  });

  useEffect(() => {
    if (images.length > 0) {
      const firstImg = images[0];
      firstImg.onload = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const ratio = Math.max(canvas.width / firstImg.naturalWidth, canvas.height / firstImg.naturalHeight);
        const newWidth = firstImg.naturalWidth * ratio;
        const newHeight = firstImg.naturalHeight * ratio;
        const x = (canvas.width - newWidth) / 2;
        const y = (canvas.height - newHeight) / 2;
        ctx.drawImage(firstImg, x, y, newWidth, newHeight);
      }
    }
  }, [images]);

  useEffect(() => {
    const handleResize = () => {
       const index = Math.max(0, Math.min(239, Math.floor(frameIndex.get()) - 1));
       if (images[index] && images[index].complete && canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          const ratio = Math.max(canvas.width / images[index].naturalWidth, canvas.height / images[index].naturalHeight);
          const newWidth = images[index].naturalWidth * ratio;
          const newHeight = images[index].naturalHeight * ratio;
          const x = (canvas.width - newWidth) / 2;
          const y = (canvas.height - newHeight) / 2;
          ctx.drawImage(images[index], x, y, newWidth, newHeight);
       }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [images, frameIndex]);



  const text2Opacity = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.65], [0, 1, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.35, 0.65], [100, -100]);

  const text3Opacity = useTransform(scrollYProgress, [0.7, 0.8, 0.95, 1], [0, 1, 1, 0]);
  const text3Y = useTransform(scrollYProgress, [0.7, 1], [100, 0]);

  return (
    <section ref={containerRef} style={{ height: '400vh', position: 'relative' }} id="home">
      <div style={{ position: 'sticky', top: 0, height: '100dvh', overflow: 'hidden' }}>
        <canvas 
          ref={canvasRef} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        
        <div className="hero-overlay" style={{ zIndex: 1, position: 'absolute', inset: 0 }}></div>



        {/* Text 2: Feature 1 */}
        <div className="hero-feature-container hero-feature-1">
          <motion.div 
            className="hero-content hero-feature-content-1" 
            style={{ opacity: text2Opacity, y: text2Y, pointerEvents: 'auto' }}
          >
            <h2 className="title-glow hero-feature-title">
              <span className="text-accent">AERODYNAMIC</span><br />PRECISION
            </h2>
            <p className="hero-feature-desc">
              Every curve meticulously crafted to slice through the air, minimizing drag and maximizing performance on the track.
            </p>
          </motion.div>
        </div>

        {/* Text 3: Feature 2 */}
        <div className="hero-feature-container hero-feature-2">
          <motion.div 
            className="hero-content hero-feature-content-2" 
            style={{ opacity: text3Opacity, y: text3Y, pointerEvents: 'auto' }}
          >
            <h2 className="title-glow hero-feature-title">
              CARBON FIBER<br /><span className="text-accent">CHASSIS</span>
            </h2>
            <p className="hero-feature-desc">
              Ultra-lightweight yet incredibly rigid. The ultimate balance of safety and extreme agility without compromise.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="about section-container">
      <div className="about-grid">
        <motion.div 
          className="about-img-container"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <img 
            src="/assets/hero_mustang.png" 
            alt="Detaling process" 
            style={{ width: '100%', height: 'auto', display: 'block', filter: 'brightness(0.7)' }} 
          />
        </motion.div>
        
        <motion.div 
          className="about-content"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="title-glow">The <span className="text-accent">Art</span> of Detailing</h2>
          <p>
            At Automorph, we treat every vehicle that enters our studio as a canvas. 
            Our master technicians employ cutting-edge techniques and premium products 
            to restore, protect, and enhance your vehicle's aesthetic appeal.
          </p>
          <p>
            We don't just clean cars; we meticulously correct imperfections and apply 
            advanced protective coatings that redefine the standards of automotive beauty.
          </p>
          
          <div className="features-list">
            <div className="feature-item">
              <Sparkles className="feature-icon" />
              <div>
                <h4>Flawless Finish</h4>
                <p>Advanced multi-stage paint correction</p>
              </div>
            </div>
            <div className="feature-item">
              <Shield className="feature-icon" />
              <div>
                <h4>Ultimate Protection</h4>
                <p>9H ceramic coating applications</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ServiceCard = ({ id, link, title, shortDesc, features, price, color }) => {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        {/* Front */}
        <div className="flip-card-front">
          <img src={link} alt={title} />
          <div className="front-overlay">
            <h3>{title}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{shortDesc}</p>
          </div>
        </div>
        {/* Back */}
        <div className="flip-card-back">
          <h3>{title}</h3>
          <p>{shortDesc}</p>
          <ul style={{ listStyle: 'none', margin: '0 0 1.5rem', flexGrow: 1 }}>
            {features.map((f, i) => (
              <li key={i} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: color }}>▹</span> {f}
              </li>
            ))}
          </ul>
          <div className="service-price">{price}</div>
          <button className="btn-primary btn-service">Book Package</button>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Ceramic Coating",
      shortDesc: "Ultimate diamond-hard protection for your exterior.",
      link: "/assets/ceramic_coating.png",
      features: [
        "9H Hardness Protection",
        "Hydrophobic Surface",
        "UV Ray Resistance",
        "5-Year Warranty"
      ],
      price: "From $899",
      color: "var(--accent-red)"
    },
    {
      id: 2,
      title: "Paint Correction",
      shortDesc: "Restore your vehicle's paint to a mirror-like finish.",
      link: "/assets/paint_correction.png",
      features: [
        "Swirl & Scratch Removal",
        "Multi-stage Polish",
        "Oxidation Treatment",
        "Restores Depth & Clarity"
      ],
      price: "From $499",
      color: "var(--accent-red)"
    },
    {
      id: 3,
      title: "Interior Metamorphosis",
      shortDesc: "Deep cleaning and conditioning of all interior surfaces.",
      link: "/assets/hero_mustang.png", // reusing for demo
      features: [
        "Steam Cleaning",
        "Leather Conditioning",
        "Odor Elimination",
        "Fabric Protection"
      ],
      price: "From $249",
      color: "var(--accent-red)"
    }
  ];

  return (
    <section id="services" className="services section-container bg-carbon">
      <motion.div 
        className="services-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <h2>Our <span className="text-accent">Services</span></h2>
        <p>Expert detailing packages designed to provide the ultimate transformation for your vehicle.</p>
      </motion.div>
      
      <div className="services-grid">
        {services.map((srv, index) => (
          <motion.div
            key={srv.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <ServiceCard {...srv} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <footer id="contact" className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <h2 className="logo" style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>
            AUTO<span>MORPH</span>
          </h2>
          <p style={{ maxWidth: '300px' }}>
            Premium automotive detailing studio specializing in high-end vehicle restoration and protection.
          </p>
          <div className="footer-social">
            <a href="#" className="social-icon">IG</a>
            <a href="#" className="social-icon">FB</a>
            <a href="#" className="social-icon">X</a>
          </div>
        </div>
        
        <div className="footer-col">
          <h4>Studio Contact</h4>
          <p><MapPin size={18} className="text-accent"/> 100 Detailing Way, Neon District, CA 90210</p>
          <p><Phone size={18} className="text-accent"/> +1 (555) 789-0123</p>
          <p><Mail size={18} className="text-accent"/> info@automorph.shop</p>
        </div>
        
        <div className="footer-col">
          <h4>Business Hours</h4>
          <p>Mon-Fri: 8:00 AM - 6:00 PM</p>
          <p>Saturday: 9:00 AM - 4:00 PM</p>
          <p>Sunday: Closed</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Automorph Premium Detailing. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

function App() {
  return (
    <div className="app bg-carbon">
      <ScrollProgressCar />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Contact />
    </div>
  );
}

export default App;
