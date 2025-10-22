import React, { useState } from 'react';
import { leaveAPI } from '../services/api';
import { Calendar, FileText, User, Phone, Users, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const LeaveForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'leave',
    reason: '',
    fromDate: '',
    toDate: '',
    semester: '1',
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    } else if (formData.reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    }

    if (!formData.fromDate) {
      newErrors.fromDate = 'From date is required';
    } else {
      const fromDate = new Date(formData.fromDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (fromDate < today) {
        newErrors.fromDate = 'From date must be today or in the future';
      }
    }

    if (!formData.toDate) {
      newErrors.toDate = 'To date is required';
    } else if (formData.fromDate && new Date(formData.toDate) < new Date(formData.fromDate)) {
      newErrors.toDate = 'To date must be after or equal to from date';
    }

    if (!formData.emergencyContact.name.trim()) {
      newErrors['emergencyContact.name'] = 'Emergency contact name is required';
    }

    if (!formData.emergencyContact.phone.trim()) {
      newErrors['emergencyContact.phone'] = 'Emergency contact phone is required';
    } else if (!/^[0-9]{10}$/.test(formData.emergencyContact.phone)) {
      newErrors['emergencyContact.phone'] = 'Phone must be a valid 10-digit number';
    }

    if (!formData.emergencyContact.relation.trim()) {
      newErrors['emergencyContact.relation'] = 'Emergency contact relation is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await leaveAPI.create(formData);
      
      if (response.data.success) {
        toast.success('Leave request submitted successfully!');
        onSuccess?.(response.data.data.leaveRequest);
        // Reset form
        setFormData({
          type: 'leave',
          reason: '',
          fromDate: '',
          toDate: '',
          semester: '1',
          emergencyContact: {
            name: '',
            phone: '',
            relation: ''
          }
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit leave request';
      toast.error(message);
      
      if (error.response?.data?.errors) {
        const apiErrors = {};
        error.response.data.errors.forEach(err => {
          apiErrors[err.param] = err.msg;
        });
        setErrors(apiErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDays = () => {
    if (formData.fromDate && formData.toDate) {
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);
      const diffTime = Math.abs(to - from);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Apply for Leave</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Leave Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Leave Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.type === 'leave' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                name="type"
                value="leave"
                checked={formData.type === 'leave'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  formData.type === 'leave' 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`}>
                  {formData.type === 'leave' && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
                <span className="font-medium">Leave</span>
              </div>
            </label>
            
            <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.type === 'on-duty' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                name="type"
                value="on-duty"
                checked={formData.type === 'on-duty'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  formData.type === 'on-duty' 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`}>
                  {formData.type === 'on-duty' && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
                <span className="font-medium">On-Duty</span>
              </div>
            </label>
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.reason ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Please provide a detailed reason for your leave request..."
          />
          {errors.reason && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.reason}
            </p>
          )}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.fromDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.fromDate && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.fromDate}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.toDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.toDate && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.toDate}
              </p>
            )}
          </div>
        </div>

        {/* Days Calculation */}
        {calculateDays() > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">
              Total Days Requested: {calculateDays()} day{calculateDays() !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Semester */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Semester
          </label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <option key={sem} value={sem.toString()}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Emergency Contact */}
        <div className="border-t pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Emergency Contact</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors['emergencyContact.name'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Contact name"
                />
              </div>
              {errors['emergencyContact.name'] && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors['emergencyContact.name']}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="emergencyContact.phone"
                  value={formData.emergencyContact.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors['emergencyContact.phone'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="10-digit number"
                  maxLength="10"
                />
              </div>
              {errors['emergencyContact.phone'] && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors['emergencyContact.phone']}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="emergencyContact.relation"
                value={formData.emergencyContact.relation}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors['emergencyContact.relation'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Father, Mother, Brother"
              />
              {errors['emergencyContact.relation'] && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors['emergencyContact.relation']}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;
