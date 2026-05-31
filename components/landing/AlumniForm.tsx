"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { 
  User, 
  Mail, 
  Calendar, 
  GraduationCap, 
  ArrowRight,
  Users,
  CheckCircle,
  Phone,
  MapPin,
  Building
} from "lucide-react";

export default function AlumniForm() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    university: "",
    graduationYear: "",
    currentLocation: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      university: "",
      graduationYear: "",
      currentLocation: ""
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <section id="alumni" className="relative py-24 sm:py-32 overflow-hidden bg-white">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[5%] w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 left-[5%] w-[350px] h-[350px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left Side - Form Fields */}
          <motion.div
            ref={ref}
            variants={fadeLeft}
            initial="hidden"
            animate={controls}
            className="order-2 lg:order-1"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Row - First & Last */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="John"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Last Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Phone Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* University Graduated From */}
              <div>
                <label htmlFor="university" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  University Graduated From *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="e.g., University of Example"
                  />
                </div>
              </div>

              {/* Graduation Year */}
              <div>
                <label htmlFor="graduationYear" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Graduation Year *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    id="graduationYear"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="">Select graduation year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Current Location */}
              <div>
                <label htmlFor="currentLocation" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Current Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    id="currentLocation"
                    name="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="City, State/Province, Country"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-sky-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] mt-6"
              >
                <span className="text-sm tracking-wide">Join Alumni Network</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>

              {/* Success Message */}
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-green-700 font-medium">Successfully joined the alumni network!</p>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate={controls}
            className="order-1 lg:order-2"
          >
            <div className="space-y-6">
              {/* Alumni Network Badge */}
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-200">
                  <Users className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-black tracking-wider text-sky-700 uppercase">Alumni Network</span>
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.h2 
                variants={fadeUp}
                className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tighter text-slate-900"
              >
                Join Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600">
                  Global Alumni
                </span>
              </motion.h2>

              {/* Description */}
              <motion.p 
                variants={fadeUp}
                className="text-base text-slate-600 leading-relaxed"
              >
                Become part of an exclusive network of graduates who are making an impact 
                in their workplaces, churches, and communities. Access mentorship, resources, 
                and lifelong connections that will accelerate your Kingdom calling.
              </motion.p>

              {/* Benefits List */}
              <motion.div 
                variants={fadeUp}
                className="space-y-3 pt-4"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-sky-600" />
                  <span className="text-sm text-slate-700">Connect with 10,000+ alumni worldwide</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-sky-600" />
                  <span className="text-sm text-slate-700">Access exclusive job opportunities</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-sky-600" />
                  <span className="text-sm text-slate-700">Attend premier networking events</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-sky-600" />
                  <span className="text-sm text-slate-700">Receive monthly leadership training</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}