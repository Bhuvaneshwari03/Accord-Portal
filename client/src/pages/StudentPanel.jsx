import React from 'react';
import LeaveForm from '../components/LeaveForm';
import LeaveList from '../components/LeaveList';

function StudentPanel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFDBBB] via-[#CCBEB1] to-[#997E67] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header - No Card */}
        <div className="mb-10">
          <h2 
            className="text-5xl font-bold mb-3 text-[#664930] drop-shadow-sm"
            style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
          >
            Student Dashboard
          </h2>
          <p 
            className="text-[#664930]/70 text-xl"
            style={{ fontFamily: "'Crimson Text', 'Georgia', serif" }}
          >
            Submit and track your leave requests
          </p>
        </div>
        
        {/* Section to apply for leave - Subtle separation */}
        <div className="mb-12">
          <LeaveForm />
        </div>

        {/* Section to view past leave */}
        <div>
          <LeaveList />
        </div>
      </div>
    </div>
  );
}

export default StudentPanel;