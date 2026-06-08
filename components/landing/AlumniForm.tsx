// components/AlumniForm.tsx (updated with dropdowns)
'use client';

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useAnimation, useInView, Variants, useScroll, useTransform } from "framer-motion";
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
  Building,
  Loader2,
  School,
  BookOpen,
  ChevronDown
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useRegistrations } from "@/hooks/useRegistrations";
import { allInstitutions, getCampusesByUniversity, University } from "@/data/campus";
import Image from "next/image";

// Generate deterministic particle positions without Math.random during render
const generateParticlePositions = (count: number) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const seed = i * 0.618033988749895;
    positions.push({
      x: ((seed * 100) % 100),
      y: ((seed * 137) % 100),
      scale: 0.3 + ((seed * 0.5) % 0.5),
      duration: 8 + ((seed * 12) % 12),
      delay: (seed * 5) % 5,
      moveX: ((seed * 50) % 100) - 50,
      moveY: -80 - ((seed * 40) % 40),
    });
  }
  return positions;
};

export default function AlumniForm() {
  const [mounted, setMounted] = useState(false);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  const { submitRegistration } = useRegistrations();

  // Parallax effects matching hero
  const { scrollY } = useScroll();
  const yBackground = useTransform(scrollY, [0, 1000], [0, 150]);
  const opacityBackground = useTransform(scrollY, [0, 500], [1, 0.4]);

  // Generate particle positions once on mount
  const particlePositions = useMemo(() => generateParticlePositions(25), []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    university: "",
    campus: "",
    department: "",
    graduationYear: "",
    currentLocation: ""
  });

  const [availableCampuses, setAvailableCampuses] = useState<Array<{id: string, name: string}>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Update campuses when university changes
  useEffect(() => {
    if (formData.university) {
      const selectedUniv = allInstitutions.find(inst => inst.name === formData.university);
      if (selectedUniv && selectedUniv.type === 'university') {
        const campuses = getCampusesByUniversity(selectedUniv.id);
        setAvailableCampuses(campuses);
        // Reset campus selection if current selection not in new list
        if (!campuses.find(c => c.name === formData.campus)) {
          setFormData(prev => ({ ...prev, campus: "" }));
        }
      } else {
        // For private colleges or if no campuses found
        setAvailableCampuses([{ id: "main-campus", name: "Main Campus" }]);
        setFormData(prev => ({ ...prev, campus: "Main Campus" }));
      }
    } else {
      setAvailableCampuses([]);
      setFormData(prev => ({ ...prev, campus: "" }));
    }
  }, [formData.university]);

  useEffect(() => {
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
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Validate phone number format
  const validatePhoneNumber = (phone: string) => {
    const ethiopianPattern = /^(\+251|0|09)?[0-9]{9}$/;
    const internationalPattern = /^\+[1-9]\d{1,14}$/;
    return ethiopianPattern.test(phone) || internationalPattern.test(phone);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number";
    }
    if (!formData.university) errors.university = "Please select a university/college";
    if (!formData.campus) errors.campus = "Please select a campus";
    if (!formData.department.trim()) errors.department = "Department is required";
    if (!formData.graduationYear) errors.graduationYear = "Graduation year is required";
    if (!formData.currentLocation.trim()) errors.currentLocation = "Current location is required";
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showError("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = showLoading("Submitting your registration...");

    try {
      const result = await submitRegistration.mutateAsync(formData);
      
      if (result.success) {
        dismiss(loadingToast);
        showSuccess("Successfully joined the alumni network!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          university: "",
          campus: "",
          department: "",
          graduationYear: "",
          currentLocation: ""
        });
        setFieldErrors({});
      }
    } catch (error: any) {
      dismiss(loadingToast);
      if (error.message?.includes("Email")) {
        setFieldErrors(prev => ({ ...prev, email: error.message }));
        showError("This email address is already registered.");
      } else if (error.message?.includes("Phone")) {
        setFieldErrors(prev => ({ ...prev, phoneNumber: error.message }));
        showError("This phone number is already registered.");
      } else {
        showError(error.message || "Failed to submit registration.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <section id="alumni" className="relative py-24 sm:py-32 overflow-hidden bg-sky-900">
      {/* Background Image with parallax - matching hero */}
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

      {/* Modern High-End Overlay Gradients - matching hero */}
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

      {/* Hero Particles - matching hero */}
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

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left Side - Form Fields */}
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={controls}
            className="order-2 lg:order-1"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Row - First & Last */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={fadeLeft}>
                  <label htmlFor="firstName" className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
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
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl focus:outline-none transition-all text-white placeholder:text-slate-400 disabled:bg-white/5 disabled:cursor-not-allowed ${
                        fieldErrors.firstName 
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100/20' 
                          : 'border-white/20 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20'
                      }`}
                      placeholder="John"
                    />
                  </div>
                  {fieldErrors.firstName && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.firstName}</p>
                  )}
                </motion.div>

                <motion.div variants={fadeLeft}>
                  <label htmlFor="lastName" className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
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
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl focus:outline-none transition-all text-white placeholder:text-slate-400 disabled:bg-white/5 disabled:cursor-not-allowed ${
                        fieldErrors.lastName 
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100/20' 
                          : 'border-white/20 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20'
                      }`}
                      placeholder="Doe"
                    />
                  </div>
                  {fieldErrors.lastName && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.lastName}</p>
                  )}
                </motion.div>
              </div>

              {/* Email & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={fadeLeft}>
                  <label htmlFor="email" className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
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
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl focus:outline-none transition-all text-white placeholder:text-slate-400 disabled:bg-white/5 disabled:cursor-not-allowed ${
                        fieldErrors.email 
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100/20' 
                          : 'border-white/20 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20'
                      }`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
                  )}
                </motion.div>

                <motion.div variants={fadeLeft}>
                  <label htmlFor="phoneNumber" className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
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
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl focus:outline-none transition-all text-white placeholder:text-slate-400 disabled:bg-white/5 disabled:cursor-not-allowed ${
                        fieldErrors.phoneNumber 
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100/20' 
                          : 'border-white/20 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20'
                      }`}
                      placeholder="+251 911 123 456"
                    />
                  </div>
                  {fieldErrors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.phoneNumber}</p>
                  )}
                </motion.div>
              </div>

              {/* University Dropdown */}
              <motion.div variants={fadeLeft}>
                <label htmlFor="university" className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
                  University/College *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                  <select
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur-sm border rounded-xl focus:outline-none transition-all text-white appearance-none cursor-pointer disabled:bg-white/5 disabled:cursor-not-allowed ${
                      fieldErrors.university 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100/20' 
                        : 'border-white/20 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20'
                    }`}
                  >
                    <option value="" className="bg-slate-800">Select your university or college</option>
                    {allInstitutions.map((inst) => (
                      <option key={inst.id} value={inst.name} className="bg-slate-800">
                        {inst.name} {inst.type === 'private-college' ? '(Private College)' : '(University)'}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                {fieldErrors.university && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.university}</p>
                )}
              </motion.div>

              {/* Campus Dropdown */}
              <motion.div variants={fadeLeft}>
                <label htmlFor="campus" className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
                  Campus *
                </label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                  <select
                    id="campus"
                    name="campus"
                    value={formData.campus}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting || !formData.university}
                    className={`w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur-sm border rounded-xl focus:outline-none transition-all text-white appearance-none cursor-pointer disabled:bg-white/5 disabled:cursor-not-allowed ${
                      fieldErrors.campus 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100/20' 
                        : 'border-white/20 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20'
                    }`}
                  >
                    <option value="" className="bg-slate-800">
                      {!formData.university ? 'Please select a university first' : 'Select your campus'}
                    </option>
                    {availableCampuses.map((campus) => (
                      <option key={campus.id} value={campus.name} className="bg-slate-800">
                        {campus.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                {fieldErrors.campus && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.campus}</p>
                )}
              </motion.div>

              {/* Department & Graduation Year Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={fadeLeft}>
                  <label htmlFor="department" className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
                    Department/Field of Study *
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl focus:outline-none transition-all text-white placeholder:text-slate-400 disabled:bg-white/5 disabled:cursor-not-allowed ${
                        fieldErrors.department 
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100/20' 
                          : 'border-white/20 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20'
                      }`}
                      placeholder="e.g., Computer Science, Business"
                    />
                  </div>
                  {fieldErrors.department && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.department}</p>
                  )}
                </motion.div>

                <motion.div variants={fadeLeft}>
                  <label htmlFor="graduationYear" className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
                    Graduation Year *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                    <select
                      id="graduationYear"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur-sm border rounded-xl focus:outline-none transition-all text-white appearance-none cursor-pointer disabled:bg-white/5 disabled:cursor-not-allowed ${
                        fieldErrors.graduationYear 
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100/20' 
                          : 'border-white/20 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20'
                      }`}
                    >
                      <option value="" className="bg-slate-800">Select graduation year</option>
                      {years.map((year) => (
                        <option key={year} value={year} className="bg-slate-800">{year}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  {fieldErrors.graduationYear && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.graduationYear}</p>
                  )}
                </motion.div>
              </div>

              {/* Current Location */}
              <motion.div variants={fadeLeft}>
                <label htmlFor="currentLocation" className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
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
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl focus:outline-none transition-all text-white placeholder:text-slate-400 disabled:bg-white/5 disabled:cursor-not-allowed ${
                      fieldErrors.currentLocation 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100/20' 
                        : 'border-white/20 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20'
                    }`}
                    placeholder="City, Country"
                  />
                </div>
                {fieldErrors.currentLocation && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.currentLocation}</p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={fadeLeft}
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-sky-900 rounded-xl font-bold shadow-[0_20px_35px_-10px_rgba(14,165,233,0.4)] hover:shadow-[0_25px_40px_-12px_rgba(14,165,233,0.5)] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm tracking-wide">Submitting...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm tracking-wide">Join Alumni Network</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity" />
              </motion.button>
            </form>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={controls}
            className="order-1 lg:order-2"
          >
            <div className="space-y-6">
              {/* Alumni Network Badge */}
              <motion.div variants={fadeRight} className="inline-flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <Users className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-black tracking-wider text-sky-300 uppercase">Alumni Network</span>
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.h2 
                variants={fadeRight}
                className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tighter"
              >
                <span className="text-white">Join Our{' '}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-blue-400">
                  Global Alumni
                </span>
              </motion.h2>

              {/* Description */}
              <motion.p 
                variants={fadeRight}
                className="text-base text-slate-300 leading-relaxed"
              >
                Become part of an exclusive network of graduates who are making an impact 
                in their workplaces, churches, and communities. Access mentorship, resources, 
                and lifelong connections that will accelerate your Kingdom calling.
              </motion.p>

              {/* Benefits List */}
              <motion.div 
                variants={fadeRight}
                className="space-y-3 pt-4"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-sky-400" />
                  <span className="text-sm text-slate-300">Connect with 10,000+ alumni worldwide</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-sky-400" />
                  <span className="text-sm text-slate-300">Access exclusive job opportunities</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-sky-400" />
                  <span className="text-sm text-slate-300">Attend premier networking events</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-sky-400" />
                  <span className="text-sm text-slate-300">Receive monthly leadership training</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-sky-950 to-transparent pointer-events-none z-10" />
      
      {/* Grain Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </section>
  );
}