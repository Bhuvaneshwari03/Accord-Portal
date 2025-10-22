import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { leaveAPI } from '../services/api';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle, 
  TrendingUp,
  FileText,
  AlertCircle,
  BarChart3,
  PieChart
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await leaveAPI.getStats();
      if (statsResponse.data.success) {
        const statsData = statsResponse.data.data.overall;
        const newStats = {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0
        };
        
        statsData.forEach(stat => {
          newStats[stat._id] = stat.count;
          newStats.total += stat.count;
        });
        
        setStats(newStats);
      }

      // Fetch recent requests
      const requestsResponse = user?.role === 'student' 
        ? await leaveAPI.getMyRequests({ limit: 5 })
        : await leaveAPI.getAllRequests({ limit: 5 });
        
      if (requestsResponse.data.success) {
        const data = requestsResponse.data.data;
        setRecentRequests(data.docs || data.leaveRequests || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
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

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {user?.name}!
            </h1>
            <p className="text-blue-100 text-lg">
              Welcome to your {user?.role === 'student' ? 'Student' : 'Faculty'} Dashboard
            </p>
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                {user?.department}
              </span>
              {user?.studentId && (
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  ID: {user?.studentId}
                </span>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
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
              <p className="text-sm font-medium text-gray-600">Pending</p>
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

      {/* Quick Actions */}
      {user?.role === 'student' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Apply for Leave</p>
                <p className="text-sm text-gray-600">Submit a new leave request</p>
              </div>
            </button>
            
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">View My Requests</p>
                <p className="text-sm text-gray-600">Check status of your requests</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Recent Requests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Requests</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            View All
          </button>
        </div>

        {recentRequests.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">
              {user?.role === 'student' 
                ? 'You haven\'t submitted any leave requests yet' 
                : 'No leave requests to display'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {user?.role === 'student' ? 'Leave Request' : request.student?.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {request.type === 'leave' ? 'Leave' : 'On-Duty'} • {formatDate(request.fromDate)} - {formatDate(request.toDate)}
                    </p>
                    {user?.role !== 'student' && (
                      <p className="text-xs text-gray-500">
                        {request.student?.studentId} • {request.student?.department}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    <span className="ml-1 capitalize">{request.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Faculty/Admin Quick Stats */}
      {['faculty', 'admin'].includes(user?.role) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Approval Rate */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Approval Rate</h3>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                </p>
                <p className="text-sm text-gray-600">Approval Rate</p>
              </div>
            </div>
          </div>

          {/* Request Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Request Distribution</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{stats.pending}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Approved</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{stats.approved}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rejected</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{stats.rejected}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
