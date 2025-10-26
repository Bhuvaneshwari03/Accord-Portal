import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function LeaveList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth(); // Get user role

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        let url = '/leave/my-requests'; // Default URL for students
        if (user.role === 'faculty') {
          url = '/leave/pending'; // URL for faculty
        }
        
        // This API call will also fail for now,
        // but it's ready for when the server is built.
        const response = await api.get(url);
        setRequests(response.data);
      } catch (err) {
        setError('Failed to fetch leave requests.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [user.role]); // Re-fetch if user role somehow changes

  const handleApprove = async (id) => {
    // Logic for faculty to approve
    try {
      await api.put(`/leave/approve/${id}`);
      // Refresh list by filtering out the approved request
      setRequests(requests.filter(req => req._id !== id));
    } catch (err) {
      console.error('Failed to approve:', err);
    }
  };

  const handleReject = async (id) => {
    // Logic for faculty to reject
    try {
      await api.put(`/leave/reject/${id}`);
      // Refresh list by filtering out the rejected request
      setRequests(requests.filter(req => req._id !== id));
    } catch (err) {
      console.error('Failed to reject:', err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-pulse">
        <p 
          className="text-[#997E67] text-xl"
          style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
        >
          Loading requests...
        </p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
      <p 
        className="text-red-700"
        style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
      >
        {error}
      </p>
    </div>
  );

  return (
    <div>
      <h3 
        className="text-3xl font-bold mb-6 text-[#664930]"
        style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
      >
        {user.role === 'student' ? 'My Requests' : 'Pending Student Requests'}
      </h3>
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-[#FFDBBB]/20 to-[#CCBEB1]/20 rounded-xl border-2 border-dashed border-[#CCBEB1]">
            <p 
              className="text-[#997E67] text-lg"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
            >
              No requests found.
            </p>
          </div>
        ) : (
          requests.map((req) => (
            <div 
              key={req._id} 
              className="bg-gradient-to-br from-white to-[#FFDBBB]/10 border border-[#CCBEB1]/40 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p 
                    className="font-bold text-xl text-[#664930] mb-2"
                    style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
                  >
                    {user.role === 'faculty' ? `Student: ${req.studentName}` : `Type: ${req.leaveType}`}
                  </p>
                  <p 
                    className="text-[#997E67] mb-2"
                    style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
                  >
                    <span className="font-semibold">Reason:</span> {req.reason}
                  </p>
                  <p 
                    className="text-sm text-[#997E67]/80"
                    style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
                  >
                    <span className="font-semibold">Dates:</span> {new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end ml-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                    req.status === 'pending' ? 'bg-[#FFDBBB] text-[#664930] border border-[#CCBEB1]' :
                    req.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-300' :
                    'bg-red-100 text-red-800 border border-red-300'
                  }`}
                  style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
                  >
                    {req.status}
                  </span>
                  
                  {/* Show buttons only to faculty and if status is pending */}
                  {user.role === 'faculty' && req.status === 'pending' && (
                    <div className="mt-4 space-x-2 flex">
                      <button 
                        onClick={() => handleApprove(req._id)}
                        className="bg-gradient-to-br from-green-500 to-green-600 text-white px-5 py-2 rounded-lg hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                        style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(req._id)}
                        className="bg-gradient-to-br from-red-500 to-red-600 text-white px-5 py-2 rounded-lg hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                        style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LeaveList;