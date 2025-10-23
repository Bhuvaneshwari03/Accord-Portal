import React from 'react';
import LeaveList from '../components/LeaveList';

function FacultyPanel() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Faculty Dashboard</h2>
      <LeaveList />
    </div>
  );
}

export default FacultyPanel;