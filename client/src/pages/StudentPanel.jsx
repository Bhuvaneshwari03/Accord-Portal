import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LeaveForm from '../components/LeaveForm';
import LeaveList from '../components/LeaveList';
import { Plus, FileText, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

const StudentPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLeaveFormSuccess = (newRequest) => {
    setShowLeaveForm(false);
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('requests');
  };

  const handleLeaveFormCancel = () => {
    setShowLeaveForm(false);
  };

  const handleRequestUpdate = (updatedRequest) => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRequestDelete = (deletedRequestId) => {
    setRefreshTrigger(prev => prev + 1);
  };

  const tabs = [
    {
      id: 'requests',
      name: 'My Requests',
      icon: FileText,
      description: 'View and manage your leave requests'
    },
    {
      id: 'apply',
      name: 'Apply for Leave',
      icon: Plus,
      description: 'Submit a new leave or on-duty request'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Panel</h1>
            <p className="text-gray-600 mt-1">
              Manage your leave requests and apply for new ones
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-lg font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-lg font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-lg font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-lg font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'apply') {
                      setShowLeaveForm(true);
                    } else {
                      setShowLeaveForm(false);
                    }
                  }}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'requests' && !showLeaveForm && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">My Leave Requests</h2>
                  <p className="text-gray-600 mt-1">
                    View and manage all your submitted leave requests
                  </p>
                </div>
                <button
                  onClick={() => setShowLeaveForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Request</span>
                </button>
              </div>
              
              <LeaveList
                showAllRequests={false}
                onRequestUpdate={handleRequestUpdate}
                onRequestDelete={handleRequestDelete}
                refreshTrigger={refreshTrigger}
              />
            </div>
          )}

          {activeTab === 'apply' && showLeaveForm && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Apply for Leave</h2>
                  <p className="text-gray-600 mt-1">
                    Submit a new leave or on-duty request
                  </p>
                </div>
                <button
                  onClick={() => setShowLeaveForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
              
              <LeaveForm
                onSuccess={handleLeaveFormSuccess}
                onCancel={handleLeaveFormCancel}
              />
            </div>
          )}

          {activeTab === 'requests' && showLeaveForm && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Apply for Leave</h2>
                  <p className="text-gray-600 mt-1">
                    Submit a new leave or on-duty request
                  </p>
                </div>
                <button
                  onClick={() => setShowLeaveForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
              
              <LeaveForm
                onSuccess={handleLeaveFormSuccess}
                onCancel={handleLeaveFormCancel}
              />
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-blue-900 mb-2">Need Help?</h3>
            <p className="text-blue-800 mb-3">
              Here are some guidelines for submitting leave requests:
            </p>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Submit requests at least 2 days in advance</li>
              <li>• Provide detailed reasons for your leave</li>
              <li>• Ensure emergency contact information is accurate</li>
              <li>• Check for date conflicts before submitting</li>
              <li>• You can only delete pending requests</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPanel;
