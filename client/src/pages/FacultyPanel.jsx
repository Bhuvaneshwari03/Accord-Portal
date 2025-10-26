import React from 'react';
import LeaveList from '../components/LeaveList';

function FacultyPanel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFDBBB] via-[#CCBEB1] to-[#997E67] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-[#CCBEB1]/30">
          <h2 
            className="text-4xl font-bold mb-2 text-[#664930]"
            style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
          >
            Faculty Dashboard
          </h2>
          <p 
            className="text-[#997E67] text-lg"
            style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
          >
            Review and manage leave requests
          </p>
        </div>

        {/* Leave List Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-[#CCBEB1]/30">
          <LeaveList />
        </div>
      </div>
    </div>
  );
}

export default FacultyPanel;