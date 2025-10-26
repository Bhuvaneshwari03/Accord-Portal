import React from 'react';
import LeaveList from '../components/LeaveList';

function FacultyPanel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFDBBB] via-[#CCBEB1] to-[#997E67] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header - No Card */}
        <div className="mb-10">
          <h2 
            className="text-5xl font-bold mb-3 text-[#664930] drop-shadow-sm"
            style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
          >
            Faculty Dashboard
          </h2>
          <p 
            className="text-[#664930]/70 text-xl"
            style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
          >
            Review and manage leave requests
          </p>
        </div>

        {/* Leave List Container */}
        <div>
          <LeaveList />
        </div>
      </div>
    </div>
  );
}

export default FacultyPanel;