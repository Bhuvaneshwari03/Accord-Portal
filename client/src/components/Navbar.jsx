import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  GraduationCap, 
  Bell,
  Settings,
  Home,
  FileText,
  Calendar,
  Clock,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Reference for click outside handling
  const navbarRef = React.useRef(null);

  // Sample notifications - in a real app, these would come from your backend
  const notifications = [
    {
      id: 1,
      title: 'Leave Request Approved',
      message: 'Your leave request for 15th Dec has been approved',
      time: '2 hours ago',
      isRead: false
    },
    {
      id: 2,
      title: 'New Policy Update',
      message: 'Check out the new leave policy updates',
      time: '1 day ago',
      isRead: true
    }
  ];

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false); // Close the profile menu
    navigate('/login', { replace: true });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'faculty':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'faculty':
        return '👨‍🏫';
      case 'student':
        return '🎓';
      default:
        return '👤';
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    ...(user?.role === 'student' 
      ? [
          { name: 'My Requests', href: '/student', icon: User },
        ]
      : [
          { name: 'All Requests', href: '/faculty', icon: User },
        ]
    ),
  ];

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen || isNotificationsOpen) {
        const container = document.getElementById('navbar-container');
        if (container && !container.contains(event.target)) {
          setIsProfileOpen(false);
          setIsNotificationsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen, isNotificationsOpen]);

  return (
    <nav ref={navbarRef} className="bg-white shadow-lg border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">
                  Leave Portal
                </span>
                <span className="text-xs text-gray-500 -mt-1">Student Management System</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.isRead) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="navbar-dropdown absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      <button className="text-xs text-blue-600 hover:text-blue-800">Mark all as read</button>
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                          !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <Link to="/notifications" className="text-sm text-blue-600 hover:text-blue-800">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs">{getRoleIcon(user?.role)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user?.role)}`}>
                      {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                    </span>
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="navbar-dropdown absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-semibold text-xl">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{user?.email}</p>
                        <div className="flex items-center mt-1 space-x-1">
                          <span className="text-sm">{getRoleIcon(user?.role)}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(user?.role)}`}>
                            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-600">{user?.department}</p>
                      {Boolean(user?.studentId) && (
                        <p className="text-xs text-gray-600">ID: {user?.studentId}</p>
                      )}
                    </div>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Slide-out Panel */}
            <div className="mobile-menu fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-semibold text-xl">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto">
                  <div className="px-2 py-4 space-y-1">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive(item.href)
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}

                    {/* Additional Links */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Link
                        to="/notifications"
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <Bell className="w-5 h-5" />
                          <span>Notifications</span>
                        </div>
                        {notifications.some(n => !n.isRead) && (
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </Link>

                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-5 h-5" />
                        <span>Profile Settings</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
