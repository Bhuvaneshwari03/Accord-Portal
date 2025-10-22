import React, { useState, useEffect } from 'react';
import { leaveAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Edit3,
  Trash2,
  Filter,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const LeaveList = ({ 
  showAllRequests = false, 
  onRequestUpdate, 
  onRequestDelete,
  refreshTrigger 
}) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchRequests = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
        ...filters
      };

      const response = showAllRequests 
        ? await leaveAPI.getAllRequests(params)
        : await leaveAPI.getMyRequests(params);

      if (response.data.success) {
        const data = response.data.data;
        setRequests(data.docs || data.leaveRequests || []);
        setPagination(prev => ({
          ...prev,
          page: data.page || page,
          total: data.totalDocs || data.totalCount || 0,
          totalPages: data.totalPages || Math.ceil((data.totalDocs || data.totalCount || 0) / pagination.limit)
        }));
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(1);
  }, [showAllRequests, refreshTrigger, filters]);

  const handleStatusUpdate = async (requestId, status, remarks = '') => {
    try {
      const response = await leaveAPI.updateStatus(requestId, { status, facultyRemarks: remarks });
      
      if (response.data.success) {
        toast.success(`Request ${status} successfully`);
        fetchRequests(pagination.page);
        onRequestUpdate?.(response.data.data.leaveRequest);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update request';
      toast.error(message);
    }
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      await leaveAPI.delete(requestId);
      toast.success('Request deleted successfully');
      fetchRequests(pagination.page);
      onRequestDelete?.(requestId);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete request';
      toast.error(message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    return type === 'leave' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      type: '',
      search: ''
    });
  };

  const canManageRequest = (request) => {
    return ['faculty', 'admin'].includes(user?.role) || 
           (user?.role === 'student' && request.status === 'pending');
  };

  const filteredRequests = requests.filter(request => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const studentName = request.student?.name?.toLowerCase() || '';
      const reason = request.reason?.toLowerCase() || '';
      const studentId = request.student?.studentId?.toLowerCase() || '';
      
      if (!studentName.includes(searchTerm) && 
          !reason.includes(searchTerm) && 
          !studentId.includes(searchTerm)) {
        return false;
      }
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {showAllRequests ? 'All Leave Requests' : 'My Leave Requests'}
          </h2>
          <p className="text-gray-600">
            {pagination.total} request{pagination.total !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Filters Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search requests..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Type Filter */}
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="leave">Leave</option>
              <option value="on-duty">On-Duty</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-600">
            {filters.status || filters.type || filters.search 
              ? 'Try adjusting your filters' 
              : 'No leave requests to display'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Request Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(request.type)}`}>
                      {request.type === 'leave' ? 'Leave' : 'On-Duty'}
                    </span>
                    <span className="text-sm text-gray-600">
                      {request.daysRequested} day{request.daysRequested !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {showAllRequests ? request.student?.name : 'Leave Request'}
                    </h3>
                    {showAllRequests && (
                      <p className="text-sm text-gray-600">
                        {request.student?.studentId} • {request.student?.department}
                      </p>
                    )}
                  </div>

                  <p className="text-gray-700 line-clamp-2">{request.reason}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(request.fromDate)} - {formatDate(request.toDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Semester {request.semester}</span>
                    </div>
                    {request.reviewedBy && (
                      <div className="flex items-center space-x-1">
                        <span>Reviewed by {request.reviewer?.name}</span>
                      </div>
                    )}
                  </div>

                  {request.facultyRemarks && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Faculty Remarks:</span> {request.facultyRemarks}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowModal(true);
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {canManageRequest(request) && (
                    <>
                      {user?.role === 'student' && request.status === 'pending' && (
                        <button
                          onClick={() => handleDelete(request._id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      {['faculty', 'admin'].includes(user?.role) && request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(request._id, 'approved')}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve Request"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const remarks = prompt('Enter rejection remarks (optional):');
                              if (remarks !== null) {
                                handleStatusUpdate(request._id, 'rejected', remarks);
                              }
                            }}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject Request"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchRequests(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchRequests(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Request Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Student Info */}
                {showAllRequests && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Student Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{selectedRequest.student?.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Student ID:</span>
                        <span className="ml-2 font-medium">{selectedRequest.student?.studentId}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Department:</span>
                        <span className="ml-2 font-medium">{selectedRequest.student?.department}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 font-medium">{selectedRequest.student?.email}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Request Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedRequest.type)}`}>
                        {selectedRequest.type === 'leave' ? 'Leave' : 'On-Duty'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                        {getStatusIcon(selectedRequest.status)}
                        <span className="ml-1 capitalize">{selectedRequest.status}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">From Date:</span>
                      <span className="ml-2 font-medium">{formatDate(selectedRequest.fromDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">To Date:</span>
                      <span className="ml-2 font-medium">{formatDate(selectedRequest.toDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Days Requested:</span>
                      <span className="ml-2 font-medium">{selectedRequest.daysRequested}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Semester:</span>
                      <span className="ml-2 font-medium">{selectedRequest.semester}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-600">Reason:</span>
                    <p className="mt-1 text-gray-900">{selectedRequest.reason}</p>
                  </div>

                  {/* Emergency Contact */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{selectedRequest.emergencyContact?.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <span className="ml-2 font-medium">{selectedRequest.emergencyContact?.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Relation:</span>
                        <span className="ml-2 font-medium">{selectedRequest.emergencyContact?.relation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Faculty Remarks */}
                  {selectedRequest.facultyRemarks && (
                    <div>
                      <span className="text-gray-600">Faculty Remarks:</span>
                      <p className="mt-1 text-gray-900 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        {selectedRequest.facultyRemarks}
                      </p>
                    </div>
                  )}

                  {/* Review Info */}
                  {selectedRequest.reviewedBy && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Review Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Reviewed by:</span>
                          <span className="ml-2 font-medium">{selectedRequest.reviewer?.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Reviewed on:</span>
                          <span className="ml-2 font-medium">{formatDate(selectedRequest.reviewedAt)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveList;
