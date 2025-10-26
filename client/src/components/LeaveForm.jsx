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
    <div>
      <h3 
        className="text-3xl font-bold mb-6 text-[#664930]"
        style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
      >
        Apply for Leave / On-Duty
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label 
            className="block text-[#664930] mb-2 font-semibold"
            style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
          >
            Request Type
          </label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full px-4 py-3 border border-[#664930]/20 rounded-lg bg-white/80 backdrop-blur-sm focus:bg-white focus:border-[#664930] focus:ring-1 focus:ring-[#664930] outline-none transition-all duration-200 text-[#664930]"
            style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
          >
            <option value="leave">Leave</option>
            <option value="on-duty">On-Duty</option>
          </select>
        </div>
        
        <div>
          <label 
            className="block text-[#664930] mb-2 font-semibold" 
            htmlFor="reason"
            style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
          >
            Reason
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-3 border border-[#664930]/20 rounded-lg bg-white/80 backdrop-blur-sm focus:bg-white focus:border-[#664930] focus:ring-1 focus:ring-[#664930] outline-none transition-all duration-200 text-[#664930] resize-none"
            style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
            rows="3"
            placeholder="Please provide details for your request..."
            required
          ></textarea>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label 
              className="block text-[#664930] mb-2 font-semibold" 
              htmlFor="start-date"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
            >
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-[#664930]/20 rounded-lg bg-white/80 backdrop-blur-sm focus:bg-white focus:border-[#664930] focus:ring-1 focus:ring-[#664930] outline-none transition-all duration-200 text-[#664930]"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
              required
            />
          </div>
          <div>
            <label 
              className="block text-[#664930] mb-2 font-semibold" 
              htmlFor="end-date"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
            >
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border border-[#664930]/20 rounded-lg bg-white/80 backdrop-blur-sm focus:bg-white focus:border-[#664930] focus:ring-1 focus:ring-[#664930] outline-none transition-all duration-200 text-[#664930]"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
              required
            />
          </div>
        </div>
        
        {message && (
          <div className={`text-center py-2 px-4 rounded-lg ${
            message.includes('success') 
              ? 'bg-green-500/20 text-green-900 border border-green-600/30' 
              : 'bg-red-500/20 text-red-900 border border-red-600/30'
          }`}>
            <p 
              className="font-medium text-sm"
              style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
            >
              {message}
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#664930] text-[#FFDBBB] py-3 rounded-lg font-semibold hover:bg-[#997E67] shadow-md hover:shadow-lg transition-all duration-300"
          style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}

export default LeaveForm;