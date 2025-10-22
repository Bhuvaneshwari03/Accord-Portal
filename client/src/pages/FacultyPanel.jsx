import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { leaveAPI } from '../services/api';
import LeaveList from '../components/LeaveList';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText, 
  BarChart3,
  TrendingUp,
  AlertCircle,
  Filter,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';

const FacultyPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [departmentStats, setDepartmentStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await leaveAPI.getStats();
      
      if (response.data.success) {
        const data = response.data.data;
        
        // Process overall stats
        const overallStats = {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0
        };
        
        data.overall.forEach(stat => {
          overallStats[stat._id] = stat.count;
          overallStats.total += stat.count;
        });
        
        setStats(overallStats);
        setDepartmentStats(data.departmentWise || []);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestUpdate = (updatedRequest) => {
    setRefreshTrigger(prev => prev + 1);
    fetchStats(); // Refresh stats after update
  };

  const handleRequestDelete = (deletedRequestId) => {
    setRefreshTrigger(prev => prev + 1);
    fetchStats(); // Refresh stats after delete
  };

  const getApprovalRate = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.approved / stats.total) * 100);
  };

  const getPendingRate = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.pending / stats.total) * 100);
  };

  const getRejectionRate = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.rejected / stats.total) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Faculty Panel</h1>
            <p className="text-gray-600 mt-1">
              Manage and review student leave requests
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-medium text-gray-900">{user?.name}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-blue-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{getApprovalRate()}%</p>
              <p className="text-sm text-gray-600">Approval Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{getPendingRate()}%</p>
              <p className="text-sm text-gray-600">Pending Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{getRejectionRate()}%</p>
              <p className="text-sm text-gray-600">Rejection Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Statistics */}
      {departmentStats.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Department Statistics</h2>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                {departmentStats.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept._id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pending
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approved
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rejected
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approval Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departmentStats
                  .filter(dept => !selectedDepartment || dept._id === selectedDepartment)
                  .map((dept) => {
                    const approvalRate = dept.totalRequests > 0 
                      ? Math.round((dept.approved / dept.totalRequests) * 100) 
                      : 0;
                    
                    return (
                      <tr key={dept._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{dept._id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {dept.totalRequests}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {dept.pending}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {dept.approved}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {dept.rejected}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${approvalRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{approvalRate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Requests Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Leave Requests Management</h2>
            <p className="text-gray-600 mt-1">
              Review and manage all student leave requests
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button 
              onClick={fetchStats}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <LeaveList
          showAllRequests={true}
          onRequestUpdate={handleRequestUpdate}
          onRequestDelete={handleRequestDelete}
          refreshTrigger={refreshTrigger}
        />
      </div>

      {/* Quick Actions Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-blue-900 mb-2">Faculty Guidelines</h3>
            <p className="text-blue-800 mb-3">
              Here are some guidelines for reviewing leave requests:
            </p>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Review requests promptly to avoid delays for students</li>
              <li>• Check for date conflicts and academic calendar</li>
              <li>• Provide clear feedback in faculty remarks</li>
              <li>• Consider emergency situations with priority</li>
              <li>• Maintain consistent approval criteria</li>
              <li>• Document reasons for rejections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyPanel;
