"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function WorkWithUs() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [particlePositions, ] = useState<Array<{
    x: number;
    y: number;
    moveX: number;
    moveY: number;
    duration: number;
    delay: number;
    scale: number;
  }>>(() => {
    // Generate random particle positions during initial state initialization
    return Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      moveX: (Math.random() - 0.5) * 80,
      moveY: (Math.random() - 0.5) * 80,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 5,
      scale: 0.5 + Math.random() * 1.5
    }));
  });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

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

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section className="relative py-16 flex items-center justify-center overflow-hidden">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/image/1.webp')`,
        }}
      />
      
      {/* Gradient Overlay - Brand Colors */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-sky-950/90 to-slate-950 opacity-100 z-0" />
      
      {/* Animated Radial Gradient */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.3)_0%,transparent_60%)] z-0"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.9, 0.6]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Animated Bottom Ellipse */}
      <motion.div
        className="absolute bottom-0 w-full h-[40%] bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.15)_0%,transparent_70%)] z-0"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Hero Particles */}
      {particlePositions.length > 0 && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {particlePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.3)]"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: `${3 * pos.scale}px`,
                height: `${3 * pos.scale}px`,
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

      {/* Centered Card - Left Aligned Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={controls}
          className="flex justify-center"
        >
          <div className="w-full max-w-xl">
            {/* Glass Card */}
            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden p-5 sm:p-8">
              
              {/* Card Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              
              {/* Card Content - Left Aligned */}
              <div className="relative text-left">

                {/* Heading - Left Aligned */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight tracking-tighter text-white mb-3 text-left">
                  Ready to {' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-sky-400">
                    Join the
                  </span>
                  <br />
                  Community?
                </h1>

                {/* Description - Left Aligned */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mb-6 text-left">
                  Become part of a growing network of Kingdom professionals who are 
                  transforming their spheres of influence through faith-driven excellence.
                </p>

                {/* CTA Button - Left Aligned */}
                <div className="flex justify-start">
                  <button 
                    onClick={scrollToAlumni}
                    className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-white text-sky-900 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  >
                    <span className="text-xs tracking-wide">Join the Community</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}