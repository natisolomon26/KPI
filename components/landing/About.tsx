"use client";

import { useRef, useEffect } from "react";
import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { 
  ArrowRight,
  CheckCircle,
  Heart
} from "lucide-react";
import Image from "next/image";

export default function About() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="about" className="relative bg-gradient-to-br from-white via-slate-50 to-white py-20 sm:py-24 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-[300px] h-[300px] bg-sky-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Side - Image */}
          <motion.div
            ref={ref}
            variants={fadeLeft}
            initial="hidden"
            animate={controls}
            className="relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-sky-500/10">
              {/* Decorative rings */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl" />
              
              {/* Main Image */}
              <div className="relative w-full h-[400px] md:h-[450px] bg-gradient-to-br from-sky-100 to-blue-100">
                <Image
                  src="/image/back5.JPG"
                  alt="Community gathering"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate={controls}
            className="flex flex-col justify-center"
          >
            <div className="space-y-5">
              {/* Why Join Badge */}
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200">
                  <Heart className="w-3.5 h-3.5 text-sky-600 fill-sky-600/30" />
                  <span className="text-[11px] font-black tracking-wider text-sky-700 uppercase">Why Join Us</span>
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.h2 
                variants={fadeUp}
                className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tighter text-slate-900"
              >
                Bridge the Gap to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600">
                  Your Calling
                </span>
              </motion.h2>

              {/* Description */}
              <motion.p 
                variants={fadeUp}
                className="text-sm sm:text-base text-slate-600 leading-relaxed"
              >
                Transitioning from campus to the marketplace is a sacred journey. 
                We ensure you remain spiritually anchored and professionally elite, 
                connecting you with opportunities that align with your Kingdom purpose.
              </motion.p>

              {/* CTA Button */}
              <motion.div variants={fadeUp} className="pt-4">
                <button 
                  onClick={scrollToAlumni}
                  className="group relative inline-flex items-center gap-3 px-7 py-3.5 bg-sky-900 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-sky-800 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  <span className="text-xs tracking-wide">JOIN THE COMMUNITY</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity" />
                </button>
                
                <p className="mt-3 text-xs text-slate-500 flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Join thousands of professionals already transformed
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}