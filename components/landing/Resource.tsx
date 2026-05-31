"use client";

import { useRef, useEffect } from "react";
import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { 
  Briefcase, 
  Building2, 
  BookOpen, 
  Heart, 
  Church, 
  Users, 
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function Resources() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const resources = [
    {
      title: "Professionals for Kingdom Impact",
      shortTitle: "PKI",
      description: "Equipping employees to see their career as a primary mission field and a platform for excellence and ethics.",
      icon: Briefcase,
      link: "#",
      color: "sky"
    },
    {
      title: "Business for Kingdom Impact",
      shortTitle: "BKI",
      description: "Supporting entrepreneurs and business owners in creating value, providing ethical employment, and using economic resources for gospel advancement.",
      icon: Building2,
      link: "#",
      color: "blue"
    },
    {
      title: "Manuscript Bible Study",
      shortTitle: "MBS",
      description: "Maintaining spiritual hunger through inductive study, ensuring associates remain rooted in the Word as they navigate complex professional environments.",
      icon: BookOpen,
      link: "#",
      color: "indigo"
    },
    {
      title: "Marriage & Family",
      shortTitle: "Family",
      description: "Providing resources, mentorship, and community for building healthy, Christ-centered homes—the bedrock of a stable society and church.",
      icon: Heart,
      link: "#",
      color: "rose"
    },
    {
      title: "Church Engagement",
      shortTitle: "Church",
      description: "Positioning our associates as servant-leaders within the local church, ensuring they are active, contributing members who bring their professional skills to the body of Christ.",
      icon: Church,
      link: "#",
      color: "emerald"
    },
    {
      title: "Associates Ministry",
      shortTitle: "Ministry",
      description: "To re-engage in the student ministry by serving as Associate Staff, MPD Partner or on the Regional Advisory Board.",
      icon: Users,
      link: "#",
      color: "purple"
    }
  ];

  const getColorStyles = (color: string) => {
    const styles = {
      sky: "bg-sky-50 text-sky-600 group-hover:bg-sky-100",
      blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
      indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100",
      rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-100",
      emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
      purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
    };
    return styles[color as keyof typeof styles] || styles.sky;
  };

  return (
    <section id="resources" className="relative bg-white py-20 sm:py-24 overflow-hidden">
      
      {/* Minimal Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-sky-50/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-50/50 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
        >
          {/* Header Section */}
          <div className="text-center mb-12">
            {/* Resource Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center justify-center mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-[11px] font-semibold tracking-wider text-sky-700 uppercase">Kingdom Resources</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h2 
              variants={fadeUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-slate-900 mb-4"
            >
              Equipped for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
                Kingdom Impact
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p 
              variants={fadeUp}
              className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto"
            >
              Discover comprehensive resources designed to equip you for every sphere of influence
            </motion.p>
          </div>

          {/* Cards Grid - Clean 2x3 Layout */}
          <motion.div
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              const colorStyles = getColorStyles(resource.color);
              
              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <div className="h-full p-6 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:shadow-md">
                    
                    {/* Icon */}
                    <div className={`inline-flex p-2.5 rounded-lg ${colorStyles} transition-colors duration-300 mb-4`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    {/* Title with Short Title */}
                    <div className="flex items-baseline justify-between gap-2 mb-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">
                        {resource.title}
                      </h3>
                      <span className="shrink-0 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {resource.shortTitle}
                      </span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {resource.description}
                    </p>
                    
                    {/* Learn More Link */}
                    <a 
                      href={resource.link}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors group/link"
                    >
                      <span>Learn more</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}