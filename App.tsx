import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play, Armchair, Banknote, BadgeCheck, BookOpen, Activity, TrendingUp, Cpu, BrainCircuit, Coins, Menu, X } from 'lucide-react';

// --- ANIMATION UTILITIES ---

/**
 * Hook optimized for performance using IntersectionObserver
 * Triggers only once per element to save resources.
 */
function useOnScreen(options: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Use requestAnimationFrame to ensure state update happens in sync with repaint
        requestAnimationFrame(() => {
          setVisible(true);
        });
        observer.disconnect();
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [ref, visible] as const;
}

// Reusable FadeIn Component - MINIMALIST CONFIGURATION
interface FadeInProps {
  children: React.ReactNode;
  delay?: number; // Delay in ms
  className?: string;
  threshold?: number; // 0 to 1
  // yOffset removed from props to enforce consistency, hardcoded inside
}

const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  delay = 0, 
  className = "", 
  threshold = 0.1 
}) => {
  const [ref, visible] = useOnScreen({ threshold });
  
  // Minimalist Animation Constants
  const ANIMATION_DURATION = '0.8s'; // Unified speed
  const Y_OFFSET = '12px'; // Very subtle movement (Minimal)
  const EASING = 'cubic-bezier(0.2, 1, 0.3, 1)'; // "Soft Out" - starts fast, lands gently
  
  const style = {
    transitionProperty: 'opacity, transform',
    transitionDuration: ANIMATION_DURATION,
    transitionTimingFunction: EASING,
    transitionDelay: `${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? 'translate3d(0, 0, 0)' : `translate3d(0, ${Y_OFFSET}, 0)`,
    willChange: 'opacity, transform',
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

// --- MAIN APP ---

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Optimized Scroll Handler
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'The Context', href: '#vision' },
    { name: 'Technology', href: '#technology' },
    { name: 'Economics', href: '#revenue' },
    { name: 'Team', href: '#team' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-background overflow-x-hidden selection:bg-slate-200 text-gray-900 antialiased">
      
      {/* 
        NAVIGATION BAR 
      */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[800ms] ease-[cubic-bezier(0.2,1,0.3,1)] border-b transform-gpu ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md border-gray-200/50 py-3 shadow-sm' 
            : 'bg-transparent border-transparent py-8'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2 z-50">
            <span 
              className="font-serif text-2xl font-semibold tracking-tight text-black cursor-pointer select-none" 
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            >
              TESSA
            </span>
          </div>

          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="relative group font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-gray-600 hover:text-black transition-colors cursor-pointer py-2"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-[600ms] ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:w-full opacity-0 group-hover:opacity-100"></span>
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <button className={`
              px-6 py-2.5 rounded-full text-[11px] font-sans font-medium uppercase tracking-widest transition-all duration-[600ms] ease-[cubic-bezier(0.2,1,0.3,1)] shadow-sm hover:shadow-lg transform hover:-translate-y-0.5
              ${isScrolled 
                ? 'bg-black text-white hover:bg-gray-800' 
                : 'bg-black text-white hover:bg-gray-900 border border-transparent'
              }
            `}>
              Join Pilot
            </button>
          </div>

          <button 
            className="md:hidden z-50 text-black p-2 hover:bg-black/5 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>

          <div className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center transition-opacity duration-[600ms] ease-in-out ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
             <div className="flex flex-col items-center gap-8">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="font-serif text-3xl text-black hover:text-gray-500 transition-colors cursor-pointer"
                  >
                    {link.name}
                  </a>
                ))}
             </div>
          </div>
        </div>
      </nav>

      {/* 
        Background Elements - SLOWED DOWN for minimalism
      */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transform-gpu translate-z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-50/40 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-pulse" style={{ animationDuration: '15s' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-indigo-50/40 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-pulse" style={{ animationDuration: '20s', animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[20vw] h-[20vw] bg-slate-100/50 rounded-full blur-2xl opacity-50" />
      </div>

      {/* 
        SECTION 1: HERO
      */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-12 max-w-[1400px] mx-auto py-20 pt-32">
        <div className="max-w-5xl w-full">
          
          <FadeIn delay={100}>
            <div className="mb-8 md:mb-10">
              <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-gray-200 rounded-sm bg-white/50 backdrop-blur-sm transition-colors hover:border-gray-300 cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="font-mono text-[10px] md:text-[11px] tracking-[0.15em] text-gray-500 uppercase font-medium">
                  Pre Seed • 2026
                </span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] text-gray-900 mb-8 tracking-tight">
              <span className="block">The Intelligence Layer</span>
              <span className="block">for Idle Spaces</span>
            </h1>
          </FadeIn>

          <FadeIn delay={300}>
            <p className="font-sans text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mb-12 font-light">
              The first platform that uses IoT + AI to certify workspace quality 
              in real-time.  We transform underutilized real estate into 
              bookable, revenue-generating spaces. No construction required.
            </p>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              <button className="group relative px-8 py-4 bg-transparent overflow-hidden border border-gray-900 text-gray-900 shadow-sm transition-all duration-[400ms] ease-[cubic-bezier(0.2,1,0.3,1)] hover:shadow-lg active:scale-[0.98]">
                <div className="absolute inset-0 w-0 bg-gray-900 transition-all duration-[400ms] ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:w-full"></div>
                <div className="relative flex items-center gap-3">
                  <span className="font-mono text-xs tracking-[0.2em] font-semibold uppercase transition-colors group-hover:text-white">
                    Join Pilot
                  </span>
                  <ArrowRight size={14} className="transition-all duration-300 group-hover:text-white group-hover:translate-x-1" />
                </div>
              </button>

              <button className="group flex items-center gap-3 px-2 py-2 text-gray-500 hover:text-gray-900 transition-colors">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <Play size={8} className="fill-current ml-0.5" />
                </div>
                <span className="relative font-mono text-xs tracking-[0.2em] font-medium uppercase">
                  Watch Demo
                  <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-gray-900 transition-all duration-[400ms] ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:w-full"></span>
                </span>
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 
        SECTION 2: PROBLEM STATEMENT 
      */}
      <section id="vision" className="relative z-10 py-24 md:py-32 px-6 md:px-12 bg-white/40 backdrop-blur-sm border-t border-gray-100 scroll-mt-28">
        <div className="max-w-[1400px] mx-auto">
          
          <FadeIn>
            <div className="mb-20 max-w-4xl">
              <span className="block font-mono text-xs tracking-[0.2em] text-gray-400 uppercase mb-6">
                Problem Statement
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight">
                Real Estate Inefficiency: <br />
                <span className="text-gray-800">The €45B Waste Problem</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 mb-24">
            
            <FadeIn delay={0}>
              <div className="bg-gray-50/80 p-8 md:p-10 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-[600ms] ease-[cubic-bezier(0.2,1,0.3,1)] group border border-transparent hover:border-gray-100 h-full">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="block font-sans font-semibold text-5xl md:text-6xl text-gray-900 tracking-tight">65%</span>
                    <div className="h-1 w-12 bg-rose-300 mt-4 rounded-full group-hover:w-16 transition-all duration-[600ms] ease-out"></div>
                  </div>
                  <div className="p-3 bg-white rounded-full shadow-sm border border-gray-100 group-hover:border-rose-100 group-hover:bg-rose-50 transition-colors duration-300">
                    <Armchair className="w-6 h-6 text-gray-400 group-hover:text-rose-400 transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
                  Unused Meeting Space
                </h3>
                <p className="font-sans text-sm leading-relaxed text-gray-500 mb-6">
                  Of hotel meeting rooms remain empty during business hours, generating zero revenue while consuming maintenance costs.
                </p>
                <div className="font-sans text-xs italic text-gray-400">
                  (Source: Hospitality Net, 2024)
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={150}>
              <div className="bg-gray-50/80 p-8 md:p-10 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-[600ms] ease-[cubic-bezier(0.2,1,0.3,1)] group border border-transparent hover:border-gray-100 h-full">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="block font-sans font-semibold text-5xl md:text-6xl text-gray-900 tracking-tight">€45B</span>
                    <div className="h-1 w-12 bg-rose-300 mt-4 rounded-full group-hover:w-16 transition-all duration-[600ms] ease-out"></div>
                  </div>
                  <div className="p-3 bg-white rounded-full shadow-sm border border-gray-100 group-hover:border-rose-100 group-hover:bg-rose-50 transition-colors duration-300">
                    <Banknote className="w-6 h-6 text-gray-400 group-hover:text-rose-400 transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
                  Annual Value Lost
                </h3>
                <p className="font-sans text-sm leading-relaxed text-gray-500 mb-6">
                  Estimated commercial real estate value wasted annually in Europe due to static leasing models and inefficiency.
                </p>
                <div className="font-sans text-xs italic text-gray-400">
                  (Source: JLL Research, 2024)
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="bg-gray-50/80 p-8 md:p-10 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-[600ms] ease-[cubic-bezier(0.2,1,0.3,1)] group border border-transparent hover:border-gray-100 h-full">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="block font-sans font-semibold text-5xl md:text-6xl text-gray-900 tracking-tight">73%</span>
                    <div className="h-1 w-12 bg-rose-300 mt-4 rounded-full group-hover:w-16 transition-all duration-[600ms] ease-out"></div>
                  </div>
                  <div className="p-3 bg-white rounded-full shadow-sm border border-gray-100 group-hover:border-rose-100 group-hover:bg-rose-50 transition-colors duration-300">
                    <BadgeCheck className="w-6 h-6 text-gray-400 group-hover:text-rose-400 transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
                  Demand for Certification
                </h3>
                <p className="font-sans text-sm leading-relaxed text-gray-500 mb-6">
                  Of remote workers cite "Air Quality & Comfort" as a primary concern when booking flexible workspaces.
                </p>
                <div className="font-sans text-xs italic text-gray-400">
                  (Source: Remote Work Report, 2024)
                </div>
              </div>
            </FadeIn>

          </div>

          <FadeIn delay={400}>
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="font-serif text-3xl md:text-4xl text-gray-900 mb-6">
                The Gap in the Market
              </h3>
              <p className="font-sans text-lg text-gray-600 leading-relaxed font-light">
                While demand for flexible work is booming, existing supply (hotels, offices) lacks the <strong className="font-semibold text-gray-900">intelligence layer</strong> to certify quality in real-time. Current solutions rely on static photos, not live environmental data.
              </p>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* 
        SECTION 2.5: SOLUTION ARCHITECTURE 
      */}
      <section id="technology" className="relative z-10 py-24 px-6 md:px-12 bg-white/60 backdrop-blur-sm border-t border-gray-100 scroll-mt-28">
        <div className="max-w-[1400px] mx-auto">
          
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center mb-24">
              <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6">
                The Solution Architecture
              </h2>
              <p className="font-sans text-lg md:text-xl text-gray-500 leading-relaxed font-light">
                <span className="font-medium text-gray-900">From Analog Static to Digital Dynamic.</span> We engineered a closed-loop system that digitizes physical environmental data to drive automated economic decisions.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-10">
            
            <FadeIn delay={0}>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-b from-blue-50/0 to-blue-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms] ease-in-out"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 border border-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Cpu size={40} strokeWidth={1.3} />
                    </div>
                    <span className="font-mono text-xs font-bold text-gray-300 tracking-widest">STEP 01</span>
                  </div>
                  
                  <h3 className="font-serif text-2xl text-gray-900 mb-4">
                    SENSE <span className="text-gray-400 font-sans text-lg ml-2 font-light">The TESSA Node</span>
                  </h3>
                  
                  <p className="font-sans text-sm text-gray-500 leading-relaxed mb-8 min-h-[80px]">
                    A proprietary, non-intrusive sensor array designed for privacy. It monitors 7 key vectors including CO2, Noise Patterns (dB), Light (Lux), and Wi-Fi stability.
                  </p>

                  <div className="border-t border-gray-100 pt-6">
                    <div className="mb-4">
                      <span className="block font-mono text-[10px] uppercase text-gray-400 mb-1">Tech Spec</span>
                      <span className="font-mono text-xs text-gray-700">ESP32 Microcontroller + MQTT Protocol over NB-IoT.</span>
                    </div>
                    <div>
                      <span className="block font-mono text-[10px] uppercase text-gray-400 mb-1">Key Feature</span>
                      <span className="font-mono text-xs text-gray-700">No cameras, no microphones. 100% Privacy compliant.</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-b from-indigo-50/0 to-indigo-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms] ease-in-out"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <BrainCircuit size={40} strokeWidth={1.3} />
                    </div>
                    <span className="font-mono text-xs font-bold text-gray-300 tracking-widest">STEP 02</span>
                  </div>
                  
                  <h3 className="font-serif text-2xl text-gray-900 mb-4">
                    CERTIFY <span className="text-gray-400 font-sans text-lg ml-2 font-light">Edge-AI</span>
                  </h3>
                  
                  <p className="font-sans text-sm text-gray-500 leading-relaxed mb-8 min-h-[80px]">
                    Raw data is processed locally to calculate the real-time "Productivity Score". Only spaces scoring above 80/100 are unlocked for the marketplace.
                  </p>

                  <div className="border-t border-gray-100 pt-6">
                    <div className="mb-4">
                      <span className="block font-mono text-[10px] uppercase text-gray-400 mb-1">Tech Spec</span>
                      <span className="font-mono text-xs text-gray-700">Local Edge Computing for latency reduction.</span>
                    </div>
                    <div>
                      <span className="block font-mono text-[10px] uppercase text-gray-400 mb-1">Key Feature</span>
                      <span className="font-mono text-xs text-gray-700">Auto-shutdown of listings if quality drops (e.g., sudden construction noise).</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-b from-emerald-50/0 to-emerald-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms] ease-in-out"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Coins size={40} strokeWidth={1.3} />
                    </div>
                    <span className="font-mono text-xs font-bold text-gray-300 tracking-widest">STEP 03</span>
                  </div>
                  
                  <h3 className="font-serif text-2xl text-gray-900 mb-4">
                    MONETIZE <span className="text-gray-400 font-sans text-lg ml-2 font-light">Yield Engine</span>
                  </h3>
                  
                  <p className="font-sans text-sm text-gray-500 leading-relaxed mb-8 min-h-[80px]">
                    Our pricing algorithm adjusts rates hourly based on demand prediction and real-time environmental quality, maximizing RevPAR (Revenue Per Available Room).
                  </p>

                  <div className="border-t border-gray-100 pt-6">
                    <div className="mb-4">
                      <span className="block font-mono text-[10px] uppercase text-gray-400 mb-1">Tech Spec</span>
                      <span className="font-mono text-xs text-gray-700">Reinforcement Learning Model connected to Booking APIs.</span>
                    </div>
                    <div>
                      <span className="block font-mono text-[10px] uppercase text-gray-400 mb-1">Key Feature</span>
                      <span className="font-mono text-xs text-gray-700">Automated billing and access control via Smart Lock integration.</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* 
        SECTION 3: SCIENTIFIC BACKGROUND & KEY DRIVERS 
      */}
      <section className="relative z-10 py-24 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">
            
            {/* Left Column: Research Context */}
            <div>
              <FadeIn>
                <div className="mb-8">
                  <span className="font-mono text-xs tracking-[0.2em] text-gray-400 uppercase">
                    Environmental Scanning
                  </span>
                </div>
                
                <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-8 leading-tight">
                  Scientific Background and Literature
                </h2>
                
                <p className="font-sans text-lg text-gray-600 leading-relaxed font-light mb-12">
                  This project builds upon recent findings in <strong className="font-medium text-gray-900">Indoor Environmental Quality (IEQ)</strong> and its direct correlation to cognitive performance and property valuation.
                </p>

                <div className="space-y-8">
                  {/* Lit Item 1 */}
                  <div className="flex gap-4 group">
                    <BookOpen className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1 group-hover:text-blue-500 transition-colors" strokeWidth={1.5} />
                    <div>
                      <h4 className="font-sans font-semibold text-gray-900 mb-1">"The Future of Flexible Workspace"</h4>
                      <p className="font-sans text-sm text-gray-500 leading-relaxed">
                        JLL Research (2024) - Establishing the €136B market growth trajectory.
                      </p>
                    </div>
                  </div>

                  {/* Lit Item 2 */}
                  <div className="flex gap-4 group">
                    <Activity className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1 group-hover:text-blue-500 transition-colors" strokeWidth={1.5} />
                    <div>
                      <h4 className="font-sans font-semibold text-gray-900 mb-1">"IoT in Hospitality: Market Analysis"</h4>
                      <p className="font-sans text-sm text-gray-500 leading-relaxed">
                        Deloitte (2024) - Identifying barriers to IoT adoption in legacy hotels.
                      </p>
                    </div>
                  </div>

                  {/* Lit Item 3 */}
                  <div className="flex gap-4 group">
                    <TrendingUp className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1 group-hover:text-blue-500 transition-colors" strokeWidth={1.5} />
                    <div>
                      <h4 className="font-sans font-semibold text-gray-900 mb-1">"Indoor Environmental Quality Standards"</h4>
                      <p className="font-sans text-sm text-gray-500 leading-relaxed">
                        WHO (2023) - Guidelines for healthy workspaces.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right Column: Why Now Card */}
            <div>
              <FadeIn delay={200}>
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-[600ms] ease-[cubic-bezier(0.2,1,0.3,1)]">
                  <span className="block font-mono text-xs tracking-[0.2em] text-gray-400 uppercase mb-8">
                    Why Now? Key Drivers
                  </span>

                  <div className="space-y-10">
                    
                    {/* Driver 1 */}
                    <div>
                      <h4 className="font-sans text-lg font-semibold text-gray-900 mb-2">
                        1. Post-COVID Hybrid Shift
                      </h4>
                      <p className="font-sans text-sm text-gray-500 leading-relaxed">
                        The structural shift to hybrid work has created a permanent demand for "third spaces" (not home, not HQ). Requests for flexible space have increased by 300%.
                      </p>
                    </div>

                    {/* Driver 2 */}
                    <div>
                      <h4 className="font-sans text-lg font-semibold text-gray-900 mb-2">
                        2. IoT Accessibility
                      </h4>
                      <p className="font-sans text-sm text-gray-500 leading-relaxed">
                        Sensor costs have dropped 10x in 5 years. High-fidelity environmental monitoring is now economically viable for small spaces.
                      </p>
                    </div>

                    {/* Driver 3 */}
                    <div>
                      <h4 className="font-sans text-lg font-semibold text-gray-900 mb-2">
                        3. AI Maturity
                      </h4>
                      <p className="font-sans text-sm text-gray-500 leading-relaxed">
                        We can now reliably predict "Comfort Scores" using ML, moving from simple raw data to actionable quality certification.
                      </p>
                    </div>

                  </div>
                </div>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* 
        SECTION 3.5: REVENUE ARCHITECTURE
      */}
      <section id="revenue" className="relative z-10 py-24 px-6 md:px-12 bg-white/50 backdrop-blur-sm border-t border-gray-100 scroll-mt-28">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <FadeIn>
            <div className="max-w-3xl mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-full bg-white mb-6 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 font-medium">Scalable Asset-Light Model</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-gray-900">Revenue Architecture</h2>
            </div>
          </FadeIn>

          {/* Grid */}
          <div className="grid md:grid-cols-3 gap-12 border-t border-gray-200 pt-12">
            {/* Col 1 */}
            <FadeIn delay={0}>
              <div className="group">
                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-4 block group-hover:text-blue-500 transition-colors">01 — Transactional</span>
                <h3 className="font-serif text-2xl text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">Commission-Based Model</h3>
                <p className="font-sans text-sm text-gray-600 leading-relaxed border-l-2 border-gray-100 pl-4 group-hover:border-blue-200 transition-all duration-300">
                  We operate on a 25-30% take-rate for every hour booked. This aligns our incentives with the venue's success: we only earn when they earn.
                </p>
              </div>
            </FadeIn>

            {/* Col 2 */}
            <FadeIn delay={200}>
              <div className="group">
                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-4 block group-hover:text-indigo-500 transition-colors">02 — Recurring</span>
                <h3 className="font-serif text-2xl text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">Corporate Subscriptions</h3>
                <p className="font-sans text-sm text-gray-600 leading-relaxed border-l-2 border-gray-100 pl-4 group-hover:border-indigo-200 transition-all duration-300">
                  Companies pay a monthly license (€99-299) to access certified workspace networks for their employees, generating stable Monthly Recurring Revenue (MRR).
                </p>
              </div>
            </FadeIn>

            {/* Col 3 */}
            <FadeIn delay={400}>
              <div className="group">
                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-4 block group-hover:text-emerald-500 transition-colors">03 — Hardware Strategy</span>
                <h3 className="font-serif text-2xl text-gray-900 mb-6 group-hover:text-emerald-600 transition-colors">Flexible Hardware Adoption Model</h3>
                
                <div className="space-y-6 border-l-2 border-gray-100 pl-5 group-hover:border-emerald-200 transition-all duration-300">
                   
                   {/* Option A */}
                   <div className="relative">
                      <h4 className="font-sans font-semibold text-sm text-gray-900 mb-1 flex items-center gap-2">
                        OPTION A: Full Revenue-Share
                        <span className="inline-block text-[9px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Recommended</span>
                      </h4>
                      <ul className="font-sans text-xs text-gray-500 space-y-1 pl-1">
                         <li className="flex gap-2">
                           <span className="text-gray-300">–</span> Zero upfront cost
                         </li>
                         <li className="flex gap-2">
                           <span className="text-gray-300">–</span> TESSA provides hardware
                         </li>
                         <li className="flex gap-2">
                           <span className="text-gray-300">–</span> 30% commission on bookings
                         </li>
                      </ul>
                   </div>

                   {/* Option B */}
                   <div>
                      <h4 className="font-sans font-semibold text-sm text-gray-900 mb-1">OPTION B: Upfront Purchase</h4>
                      <ul className="font-sans text-xs text-gray-500 space-y-1 pl-1">
                         <li className="flex gap-2">
                           <span className="text-gray-300">–</span> One-time payment: €200-€400
                         </li>
                         <li className="flex gap-2">
                           <span className="text-gray-300">–</span> You own the hardware
                         </li>
                         <li className="flex gap-2">
                           <span className="text-gray-300">–</span> Reduced commission: 20% (vs 30%)
                         </li>
                      </ul>
                   </div>

                   {/* Option C */}
                   <div>
                      <h4 className="font-sans font-semibold text-sm text-gray-900 mb-1">OPTION C: Hybrid (Monthly Lease)</h4>
                      <ul className="font-sans text-xs text-gray-500 space-y-1 pl-1">
                         <li className="flex gap-2">
                           <span className="text-gray-300">–</span> Monthly fee: €20-€50
                         </li>
                         <li className="flex gap-2">
                           <span className="text-gray-300">–</span> Hardware included
                         </li>
                         <li className="flex gap-2">
                           <span className="text-gray-300">–</span> Commission: 25%
                         </li>
                      </ul>
                   </div>

                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 
        SECTION 4: THE FOUNDING TEAM
      */}
      <section id="team" className="relative z-10 py-24 px-6 md:px-12 border-t border-gray-100 bg-white/30 backdrop-blur-sm scroll-mt-28">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <FadeIn>
            <div className="mb-16 max-w-3xl">
               <span className="font-mono text-xs tracking-[0.2em] text-gray-400 uppercase mb-4 block">
                  The Team
               </span>
               <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6">
                  The Founding Team
               </h2>
            </div>
          </FadeIn>

          {/* Grid */}
          <div className="grid md:grid-cols-3 gap-12">
             {/* Profile 1: Tech Lead */}
             <FadeIn delay={0}>
               <div className="group">
                  <h3 className="font-serif text-2xl text-gray-900 mb-1">Nikolaj Saudella</h3>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-3"></div>
                  <p className="font-sans text-sm text-gray-500 leading-relaxed">
                    Computer Science for Management Student.<br/> Worked with Mkers and Dsyre.
                  </p>
               </div>
             </FadeIn>

             {/* Profile 2: Strategy Lead */}
             <FadeIn delay={150}>
               <div className="group">
                  <h3 className="font-serif text-2xl text-gray-900 mb-1">Matilde Santini</h3>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-3"></div>
                  <p className="font-sans text-sm text-gray-500 leading-relaxed">
                    Design NABA Student.
                  </p>
               </div>
             </FadeIn>

             {/* Profile 3: Product Lead */}
             <FadeIn delay={300}>
               <div className="group">
                  <h3 className="font-serif text-2xl text-gray-900 mb-1">Giosuè Laurenzi</h3>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-3"></div>
                  <p className="font-sans text-sm text-gray-500 leading-relaxed">
                     Computer Science for Management Student.
                  </p>
               </div>
             </FadeIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 md:px-12 border-t border-gray-200 bg-white">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          
          {/* Brand & Contact */}
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-3xl text-gray-900 tracking-tight">TESSA</h2>
              <p className="font-sans text-gray-500 text-sm mt-2">The Intelligence Layer for Idle Spaces</p>
            </div>
            
            <div>
              <a href="mailto:hello@tessa.io" className="font-mono text-sm text-gray-900 border-b border-gray-300 pb-0.5 hover:border-gray-900 hover:text-blue-600 transition-all">
                hello@tessa.io
              </a>
            </div>
          </div>

          {/* Legal & Copyright */}
          <div className="flex flex-col md:items-end gap-4">
            <div className="flex gap-6">
              <a href="#" className="font-sans text-xs text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" className="font-sans text-xs text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</a>
            </div>
            <div className="font-mono text-[10px] text-gray-400 tracking-widest uppercase">
              © 2026 TESSA Inc.
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default App;