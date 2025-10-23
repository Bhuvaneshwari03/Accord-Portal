import React from 'react';
import LeaveForm from '../components/LeaveForm';
import LeaveList from '../components/LeaveList';

function StudentPanel() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Student Dashboard</h2>
      
      {/* Section to apply for leave */}
      <LeaveForm />

      {/* Section to view past leave */}
      <LeaveList />
    </div>
  );
}

export default StudentPanel;