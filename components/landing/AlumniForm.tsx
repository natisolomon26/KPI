// components/AlumniForm.tsx (with phone number uniqueness validation)
'use client';

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
  Building,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

export default function AlumniForm() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { showSuccess, showError, showLoading, dismiss } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    university: "",
    graduationYear: "",
    currentLocation: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  // Validate phone number format (Ethiopian and international)
  const validatePhoneNumber = (phone: string) => {
    // Ethiopian phone number patterns: +251XXXXXXXXX, 0XXXXXXXXX, 09XXXXXXXX
    const ethiopianPattern = /^(\+251|0|09)?[0-9]{9}$/;
    // International pattern for other countries
    const internationalPattern = /^\+[1-9]\d{1,14}$/;
    
    return ethiopianPattern.test(phone) || internationalPattern.test(phone);
  };

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Check required fields
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
      errors.phoneNumber = "Please enter a valid phone number (e.g., +251XXXXXXXXX or 09XXXXXXXX)";
    }
    
    if (!formData.university.trim()) errors.university = "University is required";
    if (!formData.graduationYear) errors.graduationYear = "Graduation year is required";
    if (!formData.currentLocation.trim()) errors.currentLocation = "Current location is required";
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      showError("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = showLoading("Submitting your registration...");

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dismiss(loadingToast);
        showSuccess("Successfully joined the alumni network!");
        
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          university: "",
          graduationYear: "",
          currentLocation: ""
        });
        setFieldErrors({});
      } else {
        dismiss(loadingToast);
        
        // Handle specific error messages
        if (data.error === "Email already registered") {
          setFieldErrors(prev => ({ ...prev, email: "This email is already registered" }));
          showError("This email address is already registered. Please use a different email.");
        } else if (data.error === "Phone number already registered" || data.error?.includes("phone")) {
          setFieldErrors(prev => ({ ...prev, phoneNumber: "This phone number is already registered" }));
          showError("This phone number is already registered. Please use a different phone number.");
        } else {
          showError(data.error || "Failed to submit registration. Please try again.");
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      dismiss(loadingToast);
      showError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed ${
                        fieldErrors.firstName 
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                          : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
                      }`}
                      placeholder="John"
                    />
                  </div>
                  {fieldErrors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>
                  )}
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
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed ${
                        fieldErrors.lastName 
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                          : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
                      }`}
                      placeholder="Doe"
                    />
                  </div>
                  {fieldErrors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>
                  )}
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
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed ${
                        fieldErrors.email 
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                          : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
                      }`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                  )}
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
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed ${
                        fieldErrors.phoneNumber 
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                          : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
                      }`}
                      placeholder="+251 911 123 456"
                    />
                  </div>
                  {fieldErrors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.phoneNumber}</p>
                  )}
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
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed ${
                      fieldErrors.university 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                        : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
                    }`}
                    placeholder="e.g., Addis Ababa University"
                  />
                </div>
                {fieldErrors.university && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.university}</p>
                )}
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
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none transition-all text-slate-900 appearance-none cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed ${
                      fieldErrors.graduationYear 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                        : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
                    }`}
                  >
                    <option value="">Select graduation year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                {fieldErrors.graduationYear && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.graduationYear}</p>
                )}
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
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed ${
                      fieldErrors.currentLocation 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                        : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
                    }`}
                    placeholder="City, Country"
                  />
                </div>
                {fieldErrors.currentLocation && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.currentLocation}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-sky-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
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
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>
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