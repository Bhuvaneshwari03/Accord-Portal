const { validationResult } = require('express-validator');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

// @desc    Create a new leave request
// @route   POST /api/leaves
// @access  Private (Student)
const createLeaveRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      type,
      reason,
      fromDate,
      toDate,
      semester,
      emergencyContact
    } = req.body;

    // Check for date conflicts
    const leaveRequest = new LeaveRequest({
      studentId: req.user._id,
      type,
      reason,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      semester,
      emergencyContact
    });

    const conflict = await leaveRequest.checkDateConflict();
    if (conflict) {
      return res.status(400).json({
        success: false,
        message: 'You already have a leave request for the overlapping dates',
        conflict: {
          fromDate: conflict.fromDate,
          toDate: conflict.toDate,
          status: conflict.status
        }
      });
    }

    await leaveRequest.save();

    // Populate student details
    await leaveRequest.populate('studentId', 'name email studentId department');

    res.status(201).json({
      success: true,
      message: 'Leave request created successfully',
      data: { leaveRequest }
    });

  } catch (error) {
    console.error('Create leave request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating leave request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all leave requests for a student
// @route   GET /api/leaves/my-requests
// @access  Private (Student)
const getMyLeaveRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, academicYear } = req.query;
    const studentId = req.user._id;

    // Build filter object
    const filter = { studentId };
    if (status) filter.status = status;
    if (academicYear) filter.academicYear = academicYear;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: {
        path: 'reviewedBy',
        select: 'name email role'
      }
    };

    const leaveRequests = await LeaveRequest.paginate(filter, options);

    res.json({
      success: true,
      data: leaveRequests
    });

  } catch (error) {
    console.error('Get my leave requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leave requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all leave requests (Faculty/Admin)
// @route   GET /api/leaves
// @access  Private (Faculty/Admin)
const getAllLeaveRequests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      department,
      academicYear,
      semester,
      studentId
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (academicYear) filter.academicYear = academicYear;
    if (semester) filter.semester = semester;
    if (studentId) filter.studentId = studentId;

    // If filtering by department, we need to join with User collection
    let pipeline = [];
    
    if (department) {
      pipeline = [
        {
          $lookup: {
            from: 'users',
            localField: 'studentId',
            foreignField: '_id',
            as: 'student'
          }
        },
        {
          $unwind: '$student'
        },
        {
          $match: {
            'student.department': department,
            ...filter
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'reviewedBy',
            foreignField: '_id',
            as: 'reviewer'
          }
        },
        {
          $unwind: {
            path: '$reviewer',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            student: {
              name: 1,
              email: 1,
              studentId: 1,
              department: 1
            },
            reviewer: {
              name: 1,
              email: 1,
              role: 1
            },
            type: 1,
            reason: 1,
            fromDate: 1,
            toDate: 1,
            status: 1,
            facultyRemarks: 1,
            daysRequested: 1,
            academicYear: 1,
            semester: 1,
            createdAt: 1,
            reviewedAt: 1
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $skip: (parseInt(page) - 1) * parseInt(limit)
        },
        {
          $limit: parseInt(limit)
        }
      ];
    } else {
      pipeline = [
        {
          $lookup: {
            from: 'users',
            localField: 'studentId',
            foreignField: '_id',
            as: 'student'
          }
        },
        {
          $unwind: '$student'
        },
        {
          $match: filter
        },
        {
          $lookup: {
            from: 'users',
            localField: 'reviewedBy',
            foreignField: '_id',
            as: 'reviewer'
          }
        },
        {
          $unwind: {
            path: '$reviewer',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            student: {
              name: 1,
              email: 1,
              studentId: 1,
              department: 1
            },
            reviewer: {
              name: 1,
              email: 1,
              role: 1
            },
            type: 1,
            reason: 1,
            fromDate: 1,
            toDate: 1,
            status: 1,
            facultyRemarks: 1,
            daysRequested: 1,
            academicYear: 1,
            semester: 1,
            createdAt: 1,
            reviewedAt: 1
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $skip: (parseInt(page) - 1) * parseInt(limit)
        },
        {
          $limit: parseInt(limit)
        }
      ];
    }

    const leaveRequests = await LeaveRequest.aggregate(pipeline);

    // Get total count for pagination
    const totalCount = await LeaveRequest.countDocuments(
      department ? { 'student.department': department, ...filter } : filter
    );

    res.json({
      success: true,
      data: {
        leaveRequests,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: parseInt(page) < Math.ceil(totalCount / parseInt(limit)),
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get all leave requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leave requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get single leave request
// @route   GET /api/leaves/:id
// @access  Private
const getLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id)
      .populate('studentId', 'name email studentId department')
      .populate('reviewedBy', 'name email role');

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    res.json({
      success: true,
      data: { leaveRequest }
    });

  } catch (error) {
    console.error('Get leave request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leave request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update leave request status (Faculty/Admin)
// @route   PUT /api/leaves/:id/status
// @access  Private (Faculty/Admin)
const updateLeaveStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, facultyRemarks } = req.body;
    const leaveId = req.params.id;

    const leaveRequest = await LeaveRequest.findById(leaveId);
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Check if already processed
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Leave request has already been processed'
      });
    }

    // Update leave request
    leaveRequest.status = status;
    leaveRequest.facultyRemarks = facultyRemarks || '';
    leaveRequest.reviewedBy = req.user._id;
    leaveRequest.reviewedAt = new Date();

    await leaveRequest.save();

    // Populate the updated request
    await leaveRequest.populate([
      { path: 'studentId', select: 'name email studentId department' },
      { path: 'reviewedBy', select: 'name email role' }
    ]);

    res.json({
      success: true,
      message: `Leave request ${status} successfully`,
      data: { leaveRequest }
    });

  } catch (error) {
    console.error('Update leave status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating leave status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get leave statistics
// @route   GET /api/leaves/stats
// @access  Private (Faculty/Admin)
const getLeaveStats = async (req, res) => {
  try {
    const { academicYear, department } = req.query;
    const currentYear = academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;

    // Build match criteria
    const matchCriteria = { academicYear: currentYear };
    if (department) {
      // Need to join with users to filter by department
      const students = await User.find({ department, role: 'student' }).select('_id');
      const studentIds = students.map(student => student._id);
      matchCriteria.studentId = { $in: studentIds };
    }

    const stats = await LeaveRequest.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalDays: { $sum: '$daysRequested' }
        }
      }
    ]);

    // Get department-wise stats if no specific department
    let departmentStats = [];
    if (!department) {
      departmentStats = await LeaveRequest.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'studentId',
            foreignField: '_id',
            as: 'student'
          }
        },
        { $unwind: '$student' },
        { $match: { academicYear: currentYear } },
        {
          $group: {
            _id: '$student.department',
            totalRequests: { $sum: 1 },
            approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
            rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } }
          }
        },
        { $sort: { totalRequests: -1 } }
      ]);
    }

    res.json({
      success: true,
      data: {
        overall: stats,
        departmentWise: departmentStats,
        academicYear: currentYear
      }
    });

  } catch (error) {
    console.error('Get leave stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete leave request (Student only, if pending)
// @route   DELETE /api/leaves/:id
// @access  Private (Student)
const deleteLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Check if user owns the request
    if (leaveRequest.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own leave requests'
      });
    }

    // Check if request is still pending
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending leave requests can be deleted'
      });
    }

    await LeaveRequest.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Leave request deleted successfully'
    });

  } catch (error) {
    console.error('Delete leave request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting leave request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createLeaveRequest,
  getMyLeaveRequests,
  getAllLeaveRequests,
  getLeaveRequest,
  updateLeaveStatus,
  getLeaveStats,
  deleteLeaveRequest
};
