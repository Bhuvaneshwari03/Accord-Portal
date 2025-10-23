import LeaveRequest from '../models/LeaveRequest.js';

// @desc    Apply for leave
// @route   POST /api/leave/apply
// @access  Private (Student)
const applyLeave = async (req, res) => {
  const { leaveType, reason, startDate, endDate } = req.body;

  try {
    const leave = new LeaveRequest({
      student: req.user.id, // From 'protect' middleware
      leaveType,
      reason,
      startDate,
      endDate,
    });
    
    const createdLeave = await leave.save();
    res.status(201).json(createdLeave);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get leave requests for the logged-in student
// @route   GET /api/leave/my-requests
// @access  Private (Student)
const getMyRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find({ student: req.user.id })
      .sort({ createdAt: -1 }); // Show newest first
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all pending leave requests
// @route   GET /api/leave/pending
// @access  Private (Faculty/Admin)
const getPendingRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find({ status: 'pending' })
      // 'populate' gets the student's name from the User model
      // This is exactly what the client's LeaveList.jsx needs!
      .populate('student', 'name')
      .sort({ createdAt: 1 }); // Show oldest first
    
    // We'll rename the 'student' object to 'studentName' to match client
    const formattedRequests = requests.map(req => ({
      ...req.toObject(),
      studentName: req.student.name,
      student: req.student._id,
    }));
      
    res.json(formattedRequests);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Approve a leave request
// @route   PUT /api/leave/approve/:id
// @access  Private (Faculty/Admin)
const approveRequest = async (req, res) => {
  try {
    const request = await LeaveRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    request.status = 'approved';
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Reject a leave request
// @route   PUT /api/leave/reject/:id
// @access  Private (Faculty/Admin)
const rejectRequest = async (req, res) => {
  try {
    const request = await LeaveRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    request.status = 'rejected';
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export {
  applyLeave,
  getMyRequests,
  getPendingRequests,
  approveRequest,
  rejectRequest,
};