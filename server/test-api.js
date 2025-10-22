/**
 * Simple API test script for Student Leave Portal
 * Run this after starting the server to test basic functionality
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testStudent = {
  name: 'Test Student',
  email: 'test.student@example.com',
  password: 'password123',
  role: 'student',
  department: 'Computer Science'
};

const testFaculty = {
  name: 'Test Faculty',
  email: 'test.faculty@example.com',
  password: 'password123',
  role: 'faculty',
  department: 'Computer Science'
};

const testLeaveRequest = {
  type: 'leave',
  reason: 'Family emergency - need to attend to urgent family matter',
  fromDate: '2024-02-15',
  toDate: '2024-02-17',
  semester: '6',
  emergencyContact: {
    name: 'Jane Doe',
    phone: '9876543210',
    relation: 'Sister'
  }
};

async function testAPI() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Health Check:', healthResponse.data.message);

    // Test 2: Register Student
    console.log('\n2. Testing Student Registration...');
    const studentRegResponse = await axios.post(`${BASE_URL}/auth/register`, testStudent);
    console.log('✅ Student Registered:', studentRegResponse.data.data.user.name);
    const studentToken = studentRegResponse.data.data.token;

    // Test 3: Register Faculty
    console.log('\n3. Testing Faculty Registration...');
    const facultyRegResponse = await axios.post(`${BASE_URL}/auth/register`, testFaculty);
    console.log('✅ Faculty Registered:', facultyRegResponse.data.data.user.name);
    const facultyToken = facultyRegResponse.data.data.token;

    // Test 4: Student Login
    console.log('\n4. Testing Student Login...');
    const studentLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testStudent.email,
      password: testStudent.password
    });
    console.log('✅ Student Login Successful');

    // Test 5: Create Leave Request
    console.log('\n5. Testing Leave Request Creation...');
    const leaveResponse = await axios.post(`${BASE_URL}/leaves`, testLeaveRequest, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log('✅ Leave Request Created:', leaveResponse.data.data.leaveRequest._id);

    // Test 6: Get My Leave Requests
    console.log('\n6. Testing Get My Leave Requests...');
    const myLeavesResponse = await axios.get(`${BASE_URL}/leaves/my-requests`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log('✅ My Leave Requests Retrieved:', myLeavesResponse.data.data.docs.length, 'requests');

    // Test 7: Get All Leave Requests (Faculty)
    console.log('\n7. Testing Get All Leave Requests (Faculty)...');
    const allLeavesResponse = await axios.get(`${BASE_URL}/leaves`, {
      headers: { Authorization: `Bearer ${facultyToken}` }
    });
    console.log('✅ All Leave Requests Retrieved:', allLeavesResponse.data.data.leaveRequests.length, 'requests');

    // Test 8: Update Leave Status
    console.log('\n8. Testing Leave Status Update...');
    const leaveId = leaveResponse.data.data.leaveRequest._id;
    const updateStatusResponse = await axios.put(`${BASE_URL}/leaves/${leaveId}/status`, {
      status: 'approved',
      facultyRemarks: 'Approved for family emergency'
    }, {
      headers: { Authorization: `Bearer ${facultyToken}` }
    });
    console.log('✅ Leave Status Updated:', updateStatusResponse.data.data.leaveRequest.status);

    // Test 9: Get Leave Statistics
    console.log('\n9. Testing Leave Statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/leaves/stats`, {
      headers: { Authorization: `Bearer ${facultyToken}` }
    });
    console.log('✅ Leave Statistics Retrieved:', statsResponse.data.data.overall.length, 'categories');

    console.log('\n🎉 All API tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('- Health Check: ✅');
    console.log('- Student Registration: ✅');
    console.log('- Faculty Registration: ✅');
    console.log('- Student Login: ✅');
    console.log('- Leave Request Creation: ✅');
    console.log('- Get My Leave Requests: ✅');
    console.log('- Get All Leave Requests: ✅');
    console.log('- Update Leave Status: ✅');
    console.log('- Get Leave Statistics: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.errors) {
      console.error('Validation errors:', error.response.data.errors);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
