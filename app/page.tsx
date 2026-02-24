"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Globe, ArrowRight, ShieldCheck, Scissors, Award, Clock, TrendingUp, ChevronRight } from "lucide-react";

// --- Premium Easing Curves ---
const premiumEase = [0.22, 1, 0.36, 1];

const fadeUpText = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: premiumEase } },
};

// --- Refined 3D Tilt Card (Heavy Glass Feel) ---
const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Higher stiffness and damping for a "heavier", more premium feel
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative rounded-3xl transition-shadow duration-700 hover:shadow-[0_30px_60px_rgba(16,185,129,0.15)] ${className}`}
    >
      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} className="w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};

// --- Data ---
const products = [
  { name: "Hangtag", img: "https://images.unsplash.com/photo-1608685161394-8ce780d60d3c?auto=format&fit=crop&w=800&q=80", desc: "Custom printed hangtags for brand identity." },
  { name: "Care Label", img: "https://images.unsplash.com/photo-1590515132515-b749673eb7f2?auto=format&fit=crop&w=800&q=80", desc: "Durable and soft wash care instructions." },
  { name: "Woven Label", img: "https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?auto=format&fit=crop&w=800&q=80", desc: "Premium woven brand labels for garments." },
  { name: "Rubber Patch", img: "https://images.unsplash.com/photo-1629854495574-4b5536125cb7?auto=format&fit=crop&w=800&q=80", desc: "High-quality molded silicone and rubber patches." },
  { name: "Leather Patch", img: "https://images.unsplash.com/photo-1601334464522-8d7d9bd0721c?auto=format&fit=crop&w=800&q=80", desc: "Authentic and faux leather embossed patches." },
  { name: "Poly & Boards", img: "https://images.unsplash.com/photo-1586790170083-2f9cefacd973?auto=format&fit=crop&w=800&q=80", desc: "Complete packaging and presentation boards." },
];

const brands = [
  "Lidl", "ALDI", "Mexx", "C&A", "Primark", "H&M", "Kappa", "Walmart",
  "George", "kik", "LPP", "next", "LAGER", "OVS", "Takko Fashion", "Siplec", "FILA", "LC Waikiki"
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // --- Premium Smooth Scroll Handler ---
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    const navHeight = 90; // Height of the navbar
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-emerald-500 selection:text-white overflow-hidden">
      
      {/* Floating Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: premiumEase, delay: 0.2 }}
        className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-2xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] supports-[backdrop-filter]:bg-white/40"
      >
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={(e) => scrollToSection(e as any, 'hero')}>
            <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-105">
              <Scissors className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 group-hover:text-emerald-700 transition-colors duration-500">
              IMPRINT
            </span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-bold text-slate-500 uppercase tracking-widest">
            {['About', 'Expertise', 'Products'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                onClick={(e) => scrollToSection(e, item.toLowerCase())}
                className="relative group py-2 text-slate-900 hover:text-emerald-600 transition-colors duration-500"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-500 transition-all duration-500 ease-out group-hover:w-full"></span>
              </a>
            ))}
            <a 
              href="#contact" 
              onClick={(e) => scrollToSection(e, 'contact')}
              className="px-8 py-3.5 bg-slate-950 text-white rounded-full hover:bg-emerald-600 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:-translate-y-0.5"
            >
              Contact Us
            </a>
          </div>
        </div>
      </motion.nav>

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Parallax Background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0 w-full h-[120%] -top-[10%] opacity-60">
          <img 
            src="https://images.unsplash.com/photo-1558098329-a11cff621064?auto=format&fit=crop&w=2000&q=80" 
            alt="Garment Manufacturing" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/80 to-[#022c22]"></div>
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 grid lg:grid-cols-2 gap-16 items-center w-full">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } }
            }}
          >
            <motion.div variants={fadeUpText} className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Setting Global Standards
            </motion.div>
            
            <div className="overflow-hidden mb-6">
              <motion.h1 variants={fadeUpText} className="text-6xl md:text-8xl font-black text-white leading-[1.05] tracking-tighter">
                Precision in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-white">
                  Every Detail.
                </span>
              </motion.h1>
            </div>
            
            <motion.p variants={fadeUpText} className="text-lg md:text-xl text-slate-400 mb-10 max-w-lg leading-relaxed font-light">
              Reliable Garments Trims & Accessories Partner. Delivering absolute consistency, competitive pricing, and uncompromising quality worldwide.
            </motion.p>
            
            <motion.div variants={fadeUpText}>
              <a 
                href="#products" 
                onClick={(e) => scrollToSection(e, 'products')}
                className="group px-8 py-4 bg-white text-slate-950 rounded-full font-bold inline-flex items-center gap-3 hover:bg-emerald-500 hover:text-white transition-all duration-500"
              >
                Explore Collection 
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-emerald-400 flex items-center justify-center transition-colors duration-500">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </a>
            </motion.div>
          </motion.div>

          {/* 3D Floating Hero Element */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: premiumEase }}
            className="hidden lg:block relative perspective-1000 pl-10"
          >
            <TiltCard>
              <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl p-4 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80" 
                  alt="Premium Threads" 
                  className="w-full h-full object-cover rounded-[2rem] shadow-inner"
                />
                <div style={{ transform: "translateZ(80px)" }} className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-white flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                    <Award className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Certified</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">Export Quality</p>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-40 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          {/* Editorial Image Composition */}
          <div className="relative h-[700px] w-full hidden lg:block">
            <motion.img 
              initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
              whileInView={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
              transition={{ duration: 1.5, ease: premiumEase }}
              viewport={{ once: true, margin: "-100px" }}
              src="https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?auto=format&fit=crop&w=800&q=80"
              className="absolute top-0 left-0 w-[80%] h-[85%] object-cover rounded-[2rem] shadow-2xl z-10 filter grayscale-[20%]"
            />
            <motion.img 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: premiumEase, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
              className="absolute bottom-0 right-0 w-[60%] h-[55%] object-cover rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.15)] border-[12px] border-white z-20"
            />
          </div>

          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: premiumEase }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-10"
          >
            <div>
              <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs flex items-center gap-3 mb-6">
                <span className="w-12 h-px bg-emerald-600"></span> Corporate Profile
              </span>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                Crafting the <br/>
                <span className="text-slate-400 font-light italic">invisible details</span><br/>
                that define brands.
              </h2>
            </div>
            
            <p className="text-xl text-slate-500 leading-relaxed font-light">
              <strong className="font-bold text-slate-900">Imprint Trimming & Accessories</strong> is a trusted manufacturer and supplier of garments trims in Bangladesh. We are committed to delivering high-quality, customized trimming solutions that meet international buyer standards.
            </p>

            <div className="pt-8 border-t border-slate-100 flex items-center gap-6">
               <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
               </div>
               <div>
                 <p className="text-2xl font-bold text-slate-900">100% Quality Assurance</p>
                 <p className="text-slate-500 mt-1">Building transparent business relationships worldwide.</p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- EXPERTISE SECTION --- */}
      <section id="expertise" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
           <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: premiumEase }}
              viewport={{ once: true }}
              className="text-center mb-20"
           >
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Our Core Strengths</h2>
           </motion.div>

           <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: ShieldCheck, title: "Quality Consistency", desc: "Rigorous technical expertise ensuring every batch meets international standards." },
                { icon: TrendingUp, title: "Competitive Pricing", desc: "Optimized manufacturing processes allow us to offer the best market rates." },
                { icon: Clock, title: "On-Time Delivery", desc: "Building long-term trust through punctuality and transparent business processes." }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: premiumEase, delay: idx * 0.15 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="bg-white p-10 rounded-[2rem] border border-slate-100 hover:shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all duration-500 group"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-50 transition-colors duration-500">
                    <item.icon className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 transition-colors duration-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h4>
                  <p className="text-slate-500 leading-relaxed font-light">{item.desc}</p>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* --- 3D PRODUCTS SECTION --- */}
      <section id="products" className="py-40 px-6 bg-[#020617] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-emerald-900/20 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: premiumEase }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">Collection</span>
              </h2>
              <p className="text-slate-400 max-w-xl text-xl font-light">Engineered to elevate your brand's physical presence.</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: premiumEase, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <TiltCard>
                  <div className="group bg-slate-900/50 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white/5 hover:border-emerald-500/30 flex flex-col h-[450px] relative">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700"></div>
                    
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-[0.22,1,0.36,1]"
                    />
                    
                    <div style={{ transform: "translateZ(50px)" }} className="relative z-20 mt-auto p-10 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-3xl font-bold text-white tracking-tight">{product.name}</h3>
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                           <ChevronRight className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <p className="text-slate-300 font-light">{product.desc}</p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- INFINITE BRANDS MARQUEE --- */}
      <section className="py-32 bg-white overflow-hidden border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
           <p className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4">Trusted By Global Industry Leaders</p>
        </div>

        {mounted && (
          <div className="relative flex overflow-hidden whitespace-nowrap group">
            <div className="absolute top-0 left-0 w-48 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
            
            <motion.div 
              className="flex items-center gap-24 px-12"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 40, repeat: Infinity }}
            >
              {[...brands, ...brands].map((brand, index) => (
                <div key={index} className="flex items-center justify-center min-w-[120px]">
                  <span className="text-3xl font-black text-slate-200 uppercase tracking-tighter hover:text-slate-900 transition-colors duration-700 cursor-pointer">
                    {brand}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </section>

      {/* --- PREMIUM FOOTER / CONTACT --- */}
      <footer id="contact" className="relative bg-[#020617] text-white pt-40 pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-50"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: premiumEase }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-24 mb-32"
          >
            {/* Brand Info */}
            <div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
                Let's Build <br/> <span className="text-emerald-500">Together.</span>
              </h2>
              <p className="text-slate-400 text-xl font-light mb-12 max-w-md">
                Partner with Imprint for world-class quality consistency and on-time delivery.
              </p>
              
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <Scissors className="w-8 h-8 text-slate-950" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black tracking-tight text-white">IMPRINT</h3>
                    <p className="text-emerald-500 font-bold tracking-widest uppercase text-xs mt-1">Trimming & Accessories</p>
                 </div>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12">
              <div className="group">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Call Us</p>
                <div className="flex items-center gap-4">
                   <Phone className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                   <p className="font-medium text-slate-200 text-xl">+88 01916-429953</p>
                </div>
              </div>
              
              <div className="group">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Email Us</p>
                <div className="flex items-center gap-4">
                   <Mail className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                   <p className="font-medium text-slate-200 text-xl">imprint389@gmail.com</p>
                </div>
              </div>

              <div className="group">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Website</p>
                <div className="flex items-center gap-4">
                   <Globe className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                   <p className="font-medium text-slate-200 text-xl">www.imprinttrims.com</p>
                </div>
              </div>

              <div className="group">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Headquarters</p>
                <div className="flex items-start gap-4">
                   <MapPin className="w-6 h-6 text-emerald-500 mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                   <p className="font-medium text-slate-200 text-lg leading-relaxed">
                     153, Arambag, (3rd Floor)<br/>Motijheel, Dhaka-1000.
                   </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-between items-center text-slate-600 text-sm font-medium pt-8 border-t border-white/5">
            <p>© {new Date().getFullYear()} Imprint Trimming & Accessories. All rights reserved.</p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <span className="hover:text-emerald-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-emerald-400 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}