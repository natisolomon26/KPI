"use client";

import { useRef, useEffect } from "react";
import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { 
  Users, 
  ArrowRight,
} from "lucide-react";

export default function MentorshipProgram() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const fadeLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
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
    <section id="mentorship" className="relative bg-gradient-to-br from-white via-slate-50 to-white py-24 sm:py-32 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[5%] w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 left-[5%] w-[350px] h-[350px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side - Content */}
          <motion.div
            ref={ref}
            variants={fadeLeft}
            initial="hidden"
            animate={controls}
          >
            <div className="space-y-6">
              {/* Badge */}
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-200">
                  <Users className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-black tracking-wider text-sky-700 uppercase">Mentorship Program</span>
                </div>
              </motion.div>

              {/* Heading */}
              <motion.h2 
                variants={fadeUp}
                className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tighter text-slate-900"
              >
                Find Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600">
                  Guide
                </span>
                <br />
                for the Journey
              </motion.h2>

              {/* Description */}
              <motion.p 
                variants={fadeUp}
                className="text-base text-slate-600 leading-relaxed"
              >
                Connect with experienced leaders who will walk alongside you, offering wisdom, 
                accountability, and practical guidance for your spiritual and professional journey.
              </motion.p>

              {/* CTA Button */}
              <motion.div variants={fadeUp} className="pt-4">
                <button className="group relative inline-flex items-center gap-2 px-6 py-3 bg-sky-900 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <span className="text-sm tracking-wide">Join the community</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}