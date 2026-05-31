"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useAnimation, useInView, Variants, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Generate deterministic particle positions without Math.random during render
const generateParticlePositions = (count: number) => {
  // Use a seeded approach for deterministic values
  const positions = [];
  for (let i = 0; i < count; i++) {
    // Create deterministic but varied values based on index
    const seed = i * 0.618033988749895; // Golden ratio
    positions.push({
      x: ((seed * 100) % 100),
      y: ((seed * 137) % 100),
      scale: 0.3 + ((seed * 0.5) % 0.5),
      duration: 8 + ((seed * 12) % 12),
      delay: (seed * 5) % 5,
      // Add deterministic random movement values
      moveX: ((seed * 50) % 100) - 50,
      moveY: -80 - ((seed * 40) % 40),
    });
  }
  return positions;
};

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Parallax effects
  const { scrollY } = useScroll();
  const yBackground = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacityBackground = useTransform(scrollY, [0, 500], [1, 0.3]);

  // Generate particle positions once on mount
  const particlePositions = useMemo(() => generateParticlePositions(30), []);

  // Smooth scroll to alumni section
  const scrollToAlumni = (e: React.MouseEvent) => {
    e.preventDefault();
    const alumniSection = document.getElementById('alumni');
    if (alumniSection) {
      alumniSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    // Use setTimeout to avoid cascading renders
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    
    if (isInView) {
      controls.start("visible");
    }
    
    return () => clearTimeout(timer);
  }, [controls, isInView]);


  const fadeLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const fadeRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  // Animation for "Impact" word - with white colors
const impactVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const
    }
  },
  animate: {
    color: ["#ffffff", "#e2e8f0", "#ffffff", "#cbd5e1", "#ffffff"],
    textShadow: [
      "0 0 0px rgba(255,255,255,0)",
      "0 0 20px rgba(255,255,255,0.3)",
      "0 0 0px rgba(255,255,255,0)",
      "0 0 30px rgba(255,255,255,0.4)",
      "0 0 0px rgba(255,255,255,0)"
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

  return (
    <section className="relative min-h-[85vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden bg-sky-900">
      {/* Background Image with parallax */}
      <motion.div
        className="absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%] bg-cover bg-center origin-center"
        style={{
          backgroundImage: `url('/image/5.webp')`,
          y: yBackground,
          opacity: opacityBackground
        }}
        initial={{ scale: 1.1, filter: "blur(10px)" }}
        animate={{ scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 2.5, ease: "easeOut" }}
      />

      {/* Modern High-End Overlay Gradients - RGB Colors */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-sky-950/90 to-slate-950 opacity-100 z-0" />
      
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.3)_0%,transparent_60%)] z-0"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.9, 0.6]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute bottom-0 w-full h-[40%] bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.15)_0%,transparent_70%)] z-0"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Hero Particles - Using deterministic animations */}
      {mounted && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {particlePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.3)]"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: `${4 * pos.scale}px`,
                height: `${4 * pos.scale}px`,
              }}
              animate={{
                y: [0, pos.moveY],
                x: [0, pos.moveX],
                opacity: [0, 0.8, 0],
                scale: [0, pos.scale, 0]
              }}
              transition={{
                duration: pos.duration,
                repeat: Infinity,
                ease: "linear",
                delay: pos.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content - Left Aligned with Right Gallery */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Content */}
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={controls}
            className="text-left"
          >
            {/* Small heading */}
            <motion.h2
              variants={fadeLeft}
              className="text-xs sm:text-sm uppercase tracking-[0.3em] text-sky-400 font-semibold mb-4"
            >
              Connecting Graduates for
            </motion.h2>

            {/* Main animated heading */}
            <motion.h1
              variants={fadeLeft}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.15] mb-6"
            >
              <motion.span
                variants={impactVariants}
                animate="animate"
                className="block text-white"
              >
                Kingdom Impact
              </motion.span>
            </motion.h1>

            {/* Paragraph */}
            <motion.p
              variants={fadeLeft}
              className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed mb-8"
            >
              A platform that empowers graduates to{" "}
              <span className="text-white font-medium">grow spiritually</span>,{" "}
              <span className="text-white font-medium">connect professionally</span>, and{" "}
              <span className="text-white font-medium">serve meaningfully</span>{" "}
              beyond campus life.
            </motion.p>
            

<motion.div
  variants={fadeLeft}
  className="flex flex-col sm:flex-row items-center gap-4"
>
  <motion.button
    onClick={scrollToAlumni}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="w-full sm:w-auto px-7 py-3 bg-white text-sky-900 font-bold rounded-full shadow-[0_20px_35px_-10px_rgba(14,165,233,0.4)] transition-all uppercase tracking-wider text-xs hover:shadow-[0_25px_40px_-12px_rgba(14,165,233,0.5)] cursor-pointer"
  >
    Join the Network
  </motion.button>

  <Link href="https://evasue.net" target="_blank" rel="noopener noreferrer">
    <motion.button
      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.12)" }}
      whileTap={{ scale: 0.98 }}
      className="w-full sm:w-auto px-7 py-3 bg-white/10 backdrop-blur-md text-white font-bold rounded-full border border-white/20 transition-all uppercase tracking-wider text-xs hover:bg-white/15 cursor-pointer"
    >
      Give Back
    </motion.button>
  </Link>
</motion.div>

          </motion.div>

          {/* Right Side - Professional Gallery Layout */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate={controls}
            className="hidden lg:block"
          >
            <div className="three-image-gallery">
              <div className="images-container flex items-end gap-5">
                
                {/* Left Large Image */}
                <div className="left-container hidden xl:block">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="left-image-container h-[320px] mt-16 overflow-hidden rounded-2xl border border-white/20 bg-[#EEE] bg-cover bg-no-repeat bg-center shadow-2xl"
                    style={{ clipPath: "inset(0%)" }}
                  >
                    <Image 
                      className="!h-full w-full object-cover rounded-2xl"
                      src="/image/1.jpg" 
                      alt="Graduates gathering"
                      width={400}
                      height={320}
                    />
                  </motion.div>
                </div>

                {/* Right Column - Two Images Stacked */}
                <div className="right-container flex flex-col w-1/2 items-start gap-5 self-stretch justify-end max-h-full">
                  
                  {/* Top Image */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="top-image flex-1 max-h-[240px] w-full overflow-hidden rounded-2xl border border-white/20 bg-[#EEE] bg-cover bg-no-repeat bg-center shadow-2xl"
                    style={{ clipPath: "inset(0%)" }}
                  >
                    <Image 
                      className="!h-full w-full object-cover max-h-[240px] rounded-2xl"
                      src="/image/2.JPG" 
                      alt="Kingdom impact event"
                      width={400}
                      height={240}
                    />
                  </motion.div>

                  {/* Bottom Image */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="bottom-image max-h-[140px] md:w-full md:max-w-[280px] xl:min-w-auto xl:max-w-[200px] hidden md:flex overflow-hidden rounded-2xl border border-white/20 bg-[#EEE] bg-cover bg-no-repeat bg-center shadow-2xl"
                    style={{ clipPath: "inset(0%)" }}
                  >
                    <Image 
                      className="!h-full object-cover w-full rounded-2xl"
                      src="/image/back5.JPG" 
                      alt="Community service"
                      width={200}
                      height={140}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile version - Simple grid for smaller screens */}
          <div className="lg:hidden grid grid-cols-2 gap-4 mt-6">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="relative h-40 rounded-2xl overflow-hidden shadow-xl border border-white/20">
                <Image
                  src="/image/back5.JPG"
                  alt={`Gallery image ${idx}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-sky-950 to-transparent pointer-events-none z-10" />
      
      {/* Grain Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </section>
  );
}