import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    switch (user.role) {
      case 'student':
        navigate('/student');
        break;
      case 'faculty':
      case 'admin':
        navigate('/faculty');
        break;
      default:
        navigate('/login');
    }
  }, [user, navigate]);

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
        return 'text-[#664930] bg-[#CCBEB1]';
      case 'rejected':
        return 'text-[#664930] bg-[#997E67]';
      case 'pending':
        return 'text-[#664930] bg-[#FFDBBB]';
      default:
        return 'text-[#664930] bg-[#CCBEB1]';
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
      <div className="flex items-center justify-center min-h-screen bg-[#FBF7F4]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#997E67]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[#FBF7F4] min-h-screen p-8" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-[#997E67] to-[#664930] rounded-2xl p-10 text-[#FBF7F4] shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3 tracking-wide" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              {getGreeting()}, {user?.name}!
            </h1>
            <p className="text-[#FFDBBB] text-lg tracking-wide">
              Welcome to your {user?.role === 'student' ? 'Student' : 'Faculty'} Dashboard
            </p>
            <div className="mt-5 flex items-center space-x-4 text-sm">
              <span className="bg-[#664930] bg-opacity-40 px-4 py-2 rounded-full tracking-wide">
                {user?.department}
              </span>
              {user?.studentId && (
                <span className="bg-[#664930] bg-opacity-40 px-4 py-2 rounded-full tracking-wide">
                  ID: {user?.studentId}
                </span>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-28 h-28 bg-[#664930] bg-opacity-30 rounded-full flex items-center justify-center border-4 border-[#FFDBBB]">
              <span className="text-4xl font-bold tracking-wider">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-[#CCBEB1] p-7 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#997E67] tracking-wide uppercase">Total Requests</p>
              <p className="text-4xl font-bold text-[#664930] mt-2">{stats.total}</p>
            </div>
            <div className="w-14 h-14 bg-[#FFDBBB] rounded-xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-[#664930]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-[#CCBEB1] p-7 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#997E67] tracking-wide uppercase">Pending</p>
              <p className="text-4xl font-bold text-[#664930] mt-2">{stats.pending}</p>
            </div>
            <div className="w-14 h-14 bg-[#FFDBBB] rounded-xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-[#664930]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-[#CCBEB1] p-7 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#997E67] tracking-wide uppercase">Approved</p>
              <p className="text-4xl font-bold text-[#664930] mt-2">{stats.approved}</p>
            </div>
            <div className="w-14 h-14 bg-[#CCBEB1] rounded-xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-[#664930]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-[#CCBEB1] p-7 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#997E67] tracking-wide uppercase">Rejected</p>
              <p className="text-4xl font-bold text-[#664930] mt-2">{stats.rejected}</p>
            </div>
            <div className="w-14 h-14 bg-[#997E67] rounded-xl flex items-center justify-center">
              <XCircle className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {user?.role === 'student' && (
        <div className="bg-white rounded-2xl shadow-md border border-[#CCBEB1] p-8">
          <h2 className="text-2xl font-bold text-[#664930] mb-6 tracking-wide">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <button className="flex items-center space-x-4 p-5 border-2 border-[#CCBEB1] rounded-xl hover:bg-[#FBF7F4] hover:border-[#997E67] transition-all duration-300">
              <div className="w-12 h-12 bg-[#FFDBBB] rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#664930]" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#664930] tracking-wide">Apply for Leave</p>
                <p className="text-sm text-[#997E67] tracking-wide">Submit a new leave request</p>
              </div>
            </button>
            
            <button className="flex items-center space-x-4 p-5 border-2 border-[#CCBEB1] rounded-xl hover:bg-[#FBF7F4] hover:border-[#997E67] transition-all duration-300">
              <div className="w-12 h-12 bg-[#CCBEB1] rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#664930]" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#664930] tracking-wide">View My Requests</p>
                <p className="text-sm text-[#997E67] tracking-wide">Check status of your requests</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Recent Requests */}
      <div className="bg-white rounded-2xl shadow-md border border-[#CCBEB1] p-8">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-2xl font-bold text-[#664930] tracking-wide">Recent Requests</h2>
          <button className="text-[#997E67] hover:text-[#664930] font-semibold tracking-wide transition-colors">
            View All
          </button>
        </div>

        {recentRequests.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-[#CCBEB1] mx-auto mb-5" />
            <h3 className="text-xl font-semibold text-[#664930] mb-2 tracking-wide">No requests found</h3>
            <p className="text-[#997E67] tracking-wide">
              {user?.role === 'student' 
                ? 'You haven\'t submitted any leave requests yet' 
                : 'No leave requests to display'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request._id} className="flex items-center justify-between p-5 border-2 border-[#CCBEB1] rounded-xl hover:bg-[#FBF7F4] hover:border-[#997E67] transition-all duration-300">
                <div className="flex items-center space-x-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#664930] tracking-wide">
                      {user?.role === 'student' ? 'Leave Request' : request.student?.name}
                    </h3>
                    <p className="text-sm text-[#997E67] tracking-wide">
                      {request.type === 'leave' ? 'Leave' : 'On-Duty'} • {formatDate(request.fromDate)} - {formatDate(request.toDate)}
                    </p>
                    {user?.role !== 'student' && (
                      <p className="text-xs text-[#CCBEB1] tracking-wide">
                        {request.student?.studentId} • {request.student?.department}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium tracking-wide ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    <span className="ml-1.5 capitalize">{request.status}</span>
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
          <div className="bg-white rounded-2xl shadow-md border border-[#CCBEB1] p-8">
            <h3 className="text-xl font-bold text-[#664930] mb-6 tracking-wide">Approval Rate</h3>
            <div className="flex items-center space-x-5">
              <div className="w-20 h-20 bg-[#CCBEB1] rounded-full flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-[#664930]" />
              </div>
              <div>
                <p className="text-3xl font-bold text-[#664930]">
                  {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                </p>
                <p className="text-sm text-[#997E67] tracking-wide">Approval Rate</p>
              </div>
            </div>
          </div>

          {/* Request Distribution */}
          <div className="bg-white rounded-2xl shadow-md border border-[#CCBEB1] p-8">
            <h3 className="text-xl font-bold text-[#664930] mb-6 tracking-wide">Request Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#997E67] tracking-wide">Pending</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-[#CCBEB1] rounded-full h-2.5">
                    <div 
                      className="bg-[#FFDBBB] h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-[#664930] w-8">{stats.pending}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#997E67] tracking-wide">Approved</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-[#CCBEB1] rounded-full h-2.5">
                    <div 
                      className="bg-[#997E67] h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-[#664930] w-8">{stats.approved}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#997E67] tracking-wide">Rejected</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-[#CCBEB1] rounded-full h-2.5">
                    <div 
                      className="bg-[#664930] h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-[#664930] w-8">{stats.rejected}</span>
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