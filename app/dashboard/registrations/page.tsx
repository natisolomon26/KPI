// app/dashboard/registrations/page.tsx (updated with Add Manual modal)
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye, 
  MoreVertical, 
  Download,
  RefreshCw,
  UserPlus,
  Calendar,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  Globe,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

// Mock data - Replace with actual API data
const mockRegistrations = [
  {
    id: 'REG-001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+251 911 123 456',
    university: 'Addis Ababa University',
    graduationYear: '2020',
    currentLocation: 'Addis Ababa, Ethiopia',
    status: 'pending',
    registeredAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'REG-002',
    firstName: 'Sarah',
    lastName: 'Smith',
    email: 'sarah.smith@example.com',
    phoneNumber: '+251 922 234 567',
    university: 'Jimma University',
    graduationYear: '2019',
    currentLocation: 'Jimma, Ethiopia',
    status: 'approved',
    registeredAt: '2024-01-14T15:45:00Z',
  },
  {
    id: 'REG-003',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.b@example.com',
    phoneNumber: '+251 933 345 678',
    university: 'Bahir Dar University',
    graduationYear: '2021',
    currentLocation: 'Bahir Dar, Ethiopia',
    status: 'pending',
    registeredAt: '2024-01-13T09:15:00Z',
  },
  {
    id: 'REG-004',
    firstName: 'Emily',
    lastName: 'Johnson',
    email: 'emily.j@example.com',
    phoneNumber: '+251 944 456 789',
    university: 'Hawassa University',
    graduationYear: '2018',
    currentLocation: 'Hawassa, Ethiopia',
    status: 'approved',
    registeredAt: '2024-01-12T14:20:00Z',
  },
  {
    id: 'REG-005',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.w@example.com',
    phoneNumber: '+251 955 567 890',
    university: 'Addis Ababa University',
    graduationYear: '2022',
    currentLocation: 'Addis Ababa, Ethiopia',
    status: 'pending',
    registeredAt: '2024-01-11T11:00:00Z',
  },
];

// Generate years for dropdown (last 50 years)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

export default function RegistrationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [itemsPerPage] = useState(10);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    university: '',
    graduationYear: '',
    currentLocation: '',
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filter registrations (only search, no status filter)
  const filteredRegistrations = useMemo(() => {
    return mockRegistrations.filter(reg => {
      const matchesSearch = 
        `${reg.firstName} ${reg.lastName} ${reg.email} ${reg.university}`.toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    total: mockRegistrations.length,
    universities: [...new Set(mockRegistrations.map(r => r.university))].length,
    thisMonth: mockRegistrations.filter(r => {
      const regDate = new Date(r.registeredAt);
      const now = new Date();
      return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
    }).length,
    countries: [...new Set(mockRegistrations.map(r => r.currentLocation.split(',')[1]?.trim() || 'Ethiopia'))].length,
  };

  const handleViewDetails = (registration: any) => {
    setSelectedRegistration(registration);
    setIsViewModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      university: '',
      graduationYear: '',
      currentLocation: '',
    });
    setFormErrors({});
    setSubmitSuccess(false);
    setIsAddModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    if (!formData.university.trim()) errors.university = 'University is required';
    if (!formData.graduationYear) errors.graduationYear = 'Graduation year is required';
    if (!formData.currentLocation.trim()) errors.currentLocation = 'Current location is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmitManualRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Manual registration submitted:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Close modal after success
      setTimeout(() => {
        setIsAddModalOpen(false);
        setSubmitSuccess(false);
        // Refresh the list here (would be an API call in production)
      }, 1500);
    }, 1500);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Alumni Registrations</h1>
          <p className="text-slate-600 mt-1">View and manage alumni registration requests</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="primary" className="gap-2" onClick={handleOpenAddModal}>
            <UserPlus className="w-4 h-4" />
            Add Manual
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Registrations</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-sky-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Partner Universities</p>
              <p className="text-2xl font-bold text-slate-900">{stats.universities}</p>
              <p className="text-xs text-emerald-600 mt-1">Growing network</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">This Month</p>
              <p className="text-2xl font-bold text-slate-900">{stats.thisMonth}</p>
              <p className="text-xs text-blue-600 mt-1">New registrations</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Countries</p>
              <p className="text-2xl font-bold text-slate-900">{stats.countries}</p>
              <p className="text-xs text-purple-600 mt-1">Global reach</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </Button>
            <Button variant="ghost" className="gap-2" onClick={() => {
              setSearchTerm('');
            }}>
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Registrations Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Education
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="wait">
                {paginatedRegistrations.map((reg, index) => {
                  return (
                    <motion.tr
                      key={reg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-sky-100 to-sky-200 rounded-full flex items-center justify-center">
                            <span className="text-sky-700 font-semibold text-sm">
                              {getInitials(reg.firstName, reg.lastName)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {reg.firstName} {reg.lastName}
                            </p>
                            <p className="text-xs text-slate-500">ID: {reg.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-3 h-3" />
                            {reg.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-3 h-3" />
                            {reg.phoneNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <GraduationCap className="w-3 h-3" />
                            {reg.university}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="w-3 h-3" />
                            Class of {reg.graduationYear}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="w-3 h-3" />
                          {reg.currentLocation}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(reg)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                            <MoreVertical className="w-4 h-4 text-slate-600" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRegistrations.length)} of {filteredRegistrations.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      currentPage === page
                        ? 'bg-sky-600 text-white'
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Registration Details"
        size="lg"
      >
        {selectedRegistration && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-100 to-sky-200 rounded-full flex items-center justify-center">
                <span className="text-sky-700 font-bold text-2xl">
                  {getInitials(selectedRegistration.firstName, selectedRegistration.lastName)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedRegistration.firstName} {selectedRegistration.lastName}
                </h3>
                <p className="text-slate-600">ID: {selectedRegistration.id}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <p className="mt-1 text-slate-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {selectedRegistration.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                  <p className="mt-1 text-slate-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {selectedRegistration.phoneNumber}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">University</label>
                  <p className="mt-1 text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    {selectedRegistration.university}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Graduation Year</label>
                  <p className="mt-1 text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {selectedRegistration.graduationYear}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Location</label>
                  <p className="mt-1 text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {selectedRegistration.currentLocation}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered On</label>
                  <p className="mt-1 text-slate-900">
                    {new Date(selectedRegistration.registeredAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Manual Registration Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => !isSubmitting && setIsAddModalOpen(false)}
        title="Add Manual Registration"
        size="lg"
      >
        <form onSubmit={handleSubmitManualRegistration} className="space-y-6">
          {submitSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Registration Added Successfully!</h3>
              <p className="text-slate-600">The alumni registration has been added to the system.</p>
            </div>
          ) : (
            <>
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      formErrors.firstName ? 'border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="Enter first name"
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      formErrors.lastName ? 'border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="Enter last name"
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        formErrors.email ? 'border-red-500' : 'border-slate-200'
                      }`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        formErrors.phoneNumber ? 'border-red-500' : 'border-slate-200'
                      }`}
                      placeholder="+251 XXX XXX XXX"
                    />
                  </div>
                  {formErrors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.phoneNumber}</p>
                  )}
                </div>
              </div>

              {/* University and Graduation Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    University *
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        formErrors.university ? 'border-red-500' : 'border-slate-200'
                      }`}
                      placeholder="e.g., Addis Ababa University"
                    />
                  </div>
                  {formErrors.university && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.university}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Graduation Year *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer ${
                        formErrors.graduationYear ? 'border-red-500' : 'border-slate-200'
                      }`}
                    >
                      <option value="">Select year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  {formErrors.graduationYear && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.graduationYear}</p>
                  )}
                </div>
              </div>

              {/* Current Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Current Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      formErrors.currentLocation ? 'border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="City, Country"
                  />
                </div>
                {formErrors.currentLocation && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.currentLocation}</p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Registration'}
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
}