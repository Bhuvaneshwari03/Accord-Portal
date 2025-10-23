import React, { useState } from 'react';
import api from '../services/api'; // We'll use this to send data

function LeaveForm() {
  const [leaveType, setLeaveType] = useState('leave'); // leave or on-duty
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState(''); // For success/error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      // This is where you'll call your backend API
      // We haven't built the server endpoint yet, so this will fail for now.
      // But the frontend logic is ready.
      const response = await api.post('/leave/apply', {
        leaveType,
        reason,
        startDate,
        endDate,
      });

      setMessage('Leave request submitted successfully!');
      // Clear the form
      setReason('');
      setStartDate('');
      setEndDate('');
    } catch (error) {
      setMessage('Failed to submit request. Please try again.');
      console.error('Leave submission error:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Apply for Leave / On-Duty</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Request Type</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="leave">Leave</option>
            <option value="on-duty">On-Duty</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="reason">Reason</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            rows="3"
            required
          ></textarea>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700 mb-2" htmlFor="start-date">Start Date</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 mb-2" htmlFor="end-date">End Date</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
        </div>
        
        {message && <p className="text-sm text-center my-2">{message}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}

export default LeaveForm;