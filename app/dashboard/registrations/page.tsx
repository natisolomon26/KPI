// app/dashboard/registrations/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Eye, 
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
  Trash2,
  Edit,
  CheckCircle,
  Loader2,
  School,
  BookOpen,
  Shield,
  AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useAuthStore } from '@/store/auth.store';
import { format } from 'date-fns';
import { Registration } from '@/lib/types/api'; // Use Registration from types
import { allInstitutions, getCampusesByUniversity } from '@/data/campus';
import toast from 'react-hot-toast';

// Generate years for dropdown (last 50 years)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

export default function RegistrationsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Registration>>({});
  const [availableCampuses, setAvailableCampuses] = useState<Array<{id: string, name: string}>>([]);
  const [addFormData, setAddFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    university: '',
    campus: '',
    department: '',
    graduationYear: '',
    currentLocation: '',
  });
  const [addFormErrors, setAddFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Hooks
  const { 
    useGetRegistrations, 
    deleteRegistration, 
    updateRegistration, 
    submitRegistration,
    exportRegistrations,
    stats,
    registrations,
    isLoading,
    isFetching,
    totalPages,
    pagination,
    error
  } = useRegistrations();
  
  // Fetch registrations
  const { refetch } = useGetRegistrations(searchTerm, currentPage);

  // Update campuses when university changes in edit form
  useEffect(() => {
    if (editFormData.university) {
      const selectedUniv = allInstitutions.find(inst => inst.name === editFormData.university);
      if (selectedUniv && selectedUniv.type === 'university') {
        const campuses = getCampusesByUniversity(selectedUniv.id);
        setAvailableCampuses(campuses);
      } else {
        setAvailableCampuses([{ id: "main-campus", name: "Main Campus" }]);
      }
    }
  }, [editFormData.university]);

  // Handlers
  const handleViewDetails = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsViewModalOpen(true);
  };

  const handleEdit = (registration: Registration) => {
    if (!isAdmin) {
      toast.error('Only administrators can edit registrations');
      return;
    }
    setSelectedRegistration(registration);
    setEditFormData({
      firstName: registration.firstName,
      lastName: registration.lastName,
      email: registration.email,
      phoneNumber: registration.phoneNumber,
      university: registration.university,
      campus: registration.campus,
      department: registration.department,
      graduationYear: registration.graduationYear,
      currentLocation: registration.currentLocation,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRegistration) return;
    
    try {
      const result = await updateRegistration.mutateAsync({
        id: selectedRegistration._id,
        data: editFormData
      });
      
      if (result.success) {
        toast.success('Registration updated successfully');
        setIsEditModalOpen(false);
        refetch();
      }
    } catch (error) {
      toast.error('Failed to update registration');
    }
  };

  const handleDelete = async () => {
    if (!selectedRegistration) return;
    
    if (!isAdmin) {
      toast.error('Only administrators can delete registrations');
      return;
    }
    
    try {
      const result = await deleteRegistration.mutateAsync(selectedRegistration._id);
      if (result.success) {
        toast.success('Registration deleted successfully');
        setIsDeleteModalOpen(false);
        refetch();
      }
    } catch (error) {
      toast.error('Failed to delete registration');
    }
  };

  const handleExport = async () => {
    try {
      await exportRegistrations.mutateAsync();
      toast.success('Export successful! CSV file downloaded.');
      setIsExportModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to export data');
    }
  };

  const handleOpenAddModal = () => {
    if (!isAdmin) {
      toast.error('Only administrators can add registrations');
      return;
    }
    setAddFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      university: '',
      campus: '',
      department: '',
      graduationYear: '',
      currentLocation: '',
    });
    setAddFormErrors({});
    setSubmitSuccess(false);
    setIsAddModalOpen(true);
  };

  const validateAddForm = () => {
    const errors: Record<string, string> = {};
    
    if (!addFormData.firstName.trim()) errors.firstName = 'First name is required';
    if (!addFormData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!addFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(addFormData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!addFormData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    if (!addFormData.university) errors.university = 'University is required';
    if (!addFormData.campus) errors.campus = 'Campus is required';
    if (!addFormData.department.trim()) errors.department = 'Department is required';
    if (!addFormData.graduationYear) errors.graduationYear = 'Graduation year is required';
    if (!addFormData.currentLocation.trim()) errors.currentLocation = 'Current location is required';
    
    setAddFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({ ...prev, [name]: value }));
    if (addFormErrors[name]) {
      setAddFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmitManualRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAddForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await submitRegistration.mutateAsync(addFormData);
      
      if (result.success) {
        toast.success('Registration added successfully');
        setSubmitSuccess(true);
        setTimeout(() => {
          setIsAddModalOpen(false);
          setSubmitSuccess(false);
          refetch();
        }, 1500);
      }
    } catch (error: any) {
      console.error('Error adding registration:', error);
      toast.error(error.message || 'Failed to add registration');
      setAddFormErrors({ general: error.message || 'Failed to add registration. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        refetch();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, refetch]);

  const loading = isLoading || isFetching;

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Data</h3>
          <p className="text-slate-600">{error}</p>
          <Button 
            variant="primary" 
            className="mt-4"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Role Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Alumni Registrations</h1>
            {isAdmin ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                <Shield className="w-3 h-3" />
                Admin Access
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                <Eye className="w-3 h-3" />
                View Only
              </span>
            )}
          </div>
          <p className="text-slate-600 mt-1">
            {isAdmin ? 'Manage and view all alumni registration records' : 'View alumni registration records'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setIsExportModalOpen(true)}
            disabled={exportRegistrations.isPending || registrations.length === 0}
          >
            {exportRegistrations.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export
          </Button>
          {isAdmin && (
            <Button variant="primary" className="gap-2" onClick={handleOpenAddModal}>
              <UserPlus className="w-4 h-4" />
              Add Manual
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards - Using stats from the API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Registrations</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-slate-900">{stats.universities.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-slate-900">{stats.thisMonth.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-slate-900">{stats.countries.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
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
          <Button variant="ghost" className="gap-2" onClick={() => {
            setSearchTerm('');
            setCurrentPage(1);
            refetch();
          }}>
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </Card>

      {/* Registrations Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Applicant</TableHead>
              <TableHead className="text-left">Contact</TableHead>
              <TableHead className="text-left">Education</TableHead>
              <TableHead className="text-left">Campus & Dept</TableHead>
              <TableHead className="text-left">Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
                    <span className="ml-3 text-slate-600">Loading registrations...</span>
                  </div>
                </td>
              </TableRow>
            ) : registrations.length === 0 ? (
              <TableRow>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="w-12 h-12 text-slate-300" />
                    <p className="text-slate-500">No registrations found</p>
                    {searchTerm && (
                      <p className="text-sm text-slate-400">
                        Try adjusting your search terms
                      </p>
                    )}
                  </div>
                </td>
              </TableRow>
            ) : (
              <AnimatePresence mode="wait">
                {registrations.map((reg, index) => (
                  <motion.tr
                    key={reg._id || `reg-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <TableCell className="text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-100 to-sky-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sky-700 font-semibold text-sm">
                            {getInitials(reg.firstName, reg.lastName)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {reg.firstName} {reg.lastName}
                          </p>
                          <p className="text-xs text-slate-500">ID: {reg._id?.slice(-8) || 'N/A'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span className="break-all">{reg.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          <span>{reg.phoneNumber}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <GraduationCap className="w-3 h-3 flex-shrink-0" />
                          <span className="font-medium">{reg.university}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span>Class of {reg.graduationYear}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <School className="w-3 h-3 flex-shrink-0" />
                          <span>{reg.campus || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <BookOpen className="w-3 h-3 flex-shrink-0" />
                          <span>{reg.department || 'Not specified'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span>{reg.currentLocation}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(reg)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-slate-600" />
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleEdit(reg)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-slate-600" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRegistration(reg);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
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
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        currentPage === pageNum
                          ? 'bg-sky-600 text-white'
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
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

      {/* Footer with User Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-slate-200 pt-4 gap-2">
        <div>
          Logged in as: <span className="font-medium text-slate-600">{user?.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
            isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {isAdmin ? <Shield className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {isAdmin ? 'Admin' : 'User'}
          </span>
          <span>•</span>
          <span>{pagination.total} total records</span>
          <span>•</span>
          <span>{stats.total} alumni</span>
          <span>•</span>
          <span>{stats.universities} universities</span>
        </div>
      </div>

      {/* MODALS */}

      {/* View Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Registration Details"
        size="lg"
      >
        {selectedRegistration && (
          <div className="space-y-6">
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
                <p className="text-slate-600">ID: {selectedRegistration._id || 'N/A'}</p>
              </div>
            </div>

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
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Campus</label>
                  <p className="mt-1 text-slate-900 flex items-center gap-2">
                    <School className="w-4 h-4 text-slate-400" />
                    {selectedRegistration.campus || 'Not specified'}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                  <p className="mt-1 text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    {selectedRegistration.department || 'Not specified'}
                  </p>
                </div>
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
                    {selectedRegistration.registeredAt ? format(new Date(selectedRegistration.registeredAt), 'PPP p') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal - Admin Only */}
      {isAdmin && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Registration"
          size="lg"
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  value={editFormData.firstName || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  value={editFormData.lastName || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={editFormData.email || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={editFormData.phoneNumber || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">University *</label>
                <select
                  value={editFormData.university || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, university: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                >
                  <option value="">Select university</option>
                  {allInstitutions.map((inst) => (
                    <option key={inst.id} value={inst.name}>
                      {inst.name} {inst.type === 'private-college' ? '(Private)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campus *</label>
                <select
                  value={editFormData.campus || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, campus: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                  disabled={!editFormData.university}
                >
                  <option value="">Select campus</option>
                  {availableCampuses.map((campus) => (
                    <option key={campus.id} value={campus.name}>
                      {campus.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
                <input
                  type="text"
                  value={editFormData.department || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Year *</label>
                <select
                  value={editFormData.graduationYear || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, graduationYear: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                >
                  <option value="">Select year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Location *</label>
              <input
                type="text"
                value={editFormData.currentLocation || ''}
                onChange={(e) => setEditFormData({ ...editFormData, currentLocation: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
                placeholder="City, Country"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={updateRegistration.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal - Admin Only */}
      {isAdmin && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Registration"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-slate-600">
              Are you sure you want to delete the registration for{' '}
              <span className="font-semibold text-slate-900">
                {selectedRegistration?.firstName} {selectedRegistration?.lastName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} isLoading={deleteRegistration.isPending}>
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Manual Registration Modal - Admin Only */}
      {isAdmin && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => !isSubmitting && setIsAddModalOpen(false)}
          title="Add Manual Registration"
          size="lg"
        >
          <form onSubmit={handleSubmitManualRegistration} className="space-y-5">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={addFormData.firstName}
                      onChange={handleAddInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        addFormErrors.firstName ? 'border-red-500' : 'border-slate-200'
                      }`}
                      placeholder="Enter first name"
                    />
                    {addFormErrors.firstName && (
                      <p className="mt-1 text-xs text-red-600">{addFormErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={addFormData.lastName}
                      onChange={handleAddInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        addFormErrors.lastName ? 'border-red-500' : 'border-slate-200'
                      }`}
                      placeholder="Enter last name"
                    />
                    {addFormErrors.lastName && (
                      <p className="mt-1 text-xs text-red-600">{addFormErrors.lastName}</p>
                    )}
                  </div>
                </div>

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
                        value={addFormData.email}
                        onChange={handleAddInputChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                          addFormErrors.email ? 'border-red-500' : 'border-slate-200'
                        }`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {addFormErrors.email && (
                      <p className="mt-1 text-xs text-red-600">{addFormErrors.email}</p>
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
                        value={addFormData.phoneNumber}
                        onChange={handleAddInputChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                          addFormErrors.phoneNumber ? 'border-red-500' : 'border-slate-200'
                        }`}
                        placeholder="+251 XXX XXX XXX"
                      />
                    </div>
                    {addFormErrors.phoneNumber && (
                      <p className="mt-1 text-xs text-red-600">{addFormErrors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      University *
                    </label>
                    <select
                      name="university"
                      value={addFormData.university}
                      onChange={handleAddInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        addFormErrors.university ? 'border-red-500' : 'border-slate-200'
                      }`}
                    >
                      <option value="">Select university/college</option>
                      {allInstitutions.map((inst) => (
                        <option key={inst.id} value={inst.name}>
                          {inst.name} {inst.type === 'private-college' ? '(Private College)' : '(University)'}
                        </option>
                      ))}
                    </select>
                    {addFormErrors.university && (
                      <p className="mt-1 text-xs text-red-600">{addFormErrors.university}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Campus *
                    </label>
                    <input
                      type="text"
                      name="campus"
                      value={addFormData.campus}
                      onChange={handleAddInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        addFormErrors.campus ? 'border-red-500' : 'border-slate-200'
                      }`}
                      placeholder="e.g., Main Campus, 6 Kilo Campus"
                    />
                    {addFormErrors.campus && (
                      <p className="mt-1 text-xs text-red-600">{addFormErrors.campus}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Department *
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={addFormData.department}
                      onChange={handleAddInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        addFormErrors.department ? 'border-red-500' : 'border-slate-200'
                      }`}
                      placeholder="e.g., Computer Science, Business"
                    />
                    {addFormErrors.department && (
                      <p className="mt-1 text-xs text-red-600">{addFormErrors.department}</p>
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
                        value={addFormData.graduationYear}
                        onChange={handleAddInputChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer ${
                          addFormErrors.graduationYear ? 'border-red-500' : 'border-slate-200'
                        }`}
                      >
                        <option value="">Select year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    {addFormErrors.graduationYear && (
                      <p className="mt-1 text-xs text-red-600">{addFormErrors.graduationYear}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Current Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="currentLocation"
                      value={addFormData.currentLocation}
                      onChange={handleAddInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        addFormErrors.currentLocation ? 'border-red-500' : 'border-slate-200'
                      }`}
                      placeholder="City, Country"
                    />
                  </div>
                  {addFormErrors.currentLocation && (
                    <p className="mt-1 text-xs text-red-600">{addFormErrors.currentLocation}</p>
                  )}
                </div>

                {addFormErrors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{addFormErrors.general}</p>
                  </div>
                )}

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
      )}

      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Data"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Export Alumni Data</h3>
            <p className="text-slate-600">
              You are about to export {pagination.total} alumni records to CSV format.
            </p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              ⚠️ The CSV file will contain all registration data including personal information.
              Please handle this data responsibly.
            </p>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsExportModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleExport}
              isLoading={exportRegistrations.isPending}
            >
              {exportRegistrations.isPending ? 'Exporting...' : 'Confirm Export'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}