"use client";

import { useRef, useEffect } from "react";
import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { 
  ArrowRight
} from "lucide-react";

export default function CTA() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden bg-white">
      
      {/* Light Theme Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-100/20 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={controls}
          className="relative"
        >
          {/* Main Card */}
          <div className="relative bg-white rounded-2xl border border-sky-200 shadow-lg overflow-hidden">
            
            {/* Light gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-white/50 to-blue-50/50 pointer-events-none" />
            
            <div className="relative p-8 sm:p-10 md:p-12">
              <div className="max-w-3xl mx-auto text-center">
                
                

                {/* Heading */}
                <motion.h2 
                  variants={fadeUp}
                  className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tighter text-slate-900 mb-3"
                >
                  Ready to Join the Community?
                </motion.h2>

                {/* Description */}
                <motion.p 
                  variants={fadeUp}
                  className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto mb-6"
                >
                  Become part of a growing network of Kingdom professionals who are 
                  transforming their spheres of influence through faith-driven excellence.
                </motion.p>

                {/* CTA Button */}
                <motion.div 
                  variants={fadeUp}
                  className="flex justify-center items-center"
                >
                  <button className="group relative inline-flex items-center gap-2 px-6 py-3 bg-sky-900 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <span className="text-sm tracking-wide">Join the Community</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity" />
                  </button>
                </motion.div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}