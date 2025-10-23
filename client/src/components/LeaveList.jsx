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

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h3 className="text-2xl font-semibold mb-4">
        {user.role === 'student' ? 'My Requests' : 'Pending Student Requests'}
      </h3>
      <div className="space-y-4">
        {requests.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          requests.map((req) => (
            <div key={req._id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">
                    {user.role === 'faculty' ? `Student: ${req.studentName}` : `Type: ${req.leaveType}`}
                  </p>
                  <p>Reason: {req.reason}</p>
                  <p className="text-sm text-gray-600">
                    Dates: {new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    req.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                    req.status === 'approved' ? 'bg-green-200 text-green-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {req.status}
                  </span>
                  
                  {/* Show buttons only to faculty and if status is pending */}
                  {user.role === 'faculty' && req.status === 'pending' && (
                    <div className="mt-2 space-x-2">
                      <button 
                        onClick={() => handleApprove(req._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(req._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
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