const express = require('express');
const { body, param, query } = require('express-validator');
const {
  createLeaveRequest,
  getMyLeaveRequests,
  getAllLeaveRequests,
  getLeaveRequest,
  updateLeaveStatus,
  getLeaveStats,
  deleteLeaveRequest
} = require('../controllers/leaveController');
const {
  authenticate,
  authorize,
  canManageLeaves,
  validateLeaveOwnership
} = require('../middleware/auth');

const router = express.Router();
const auth = require("../middleware/auth");
router.get("/all", auth(["faculty","admin"]), getAllLeaves);
router.post("/", auth(["student"]), createLeave);

// Validation rules
const createLeaveValidation = [
  body('type')
    .isIn(['leave', 'on-duty'])
    .withMessage('Type must be either leave or on-duty'),
  body('reason')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),
  body('fromDate')
    .isISO8601()
    .withMessage('From date must be a valid date')
    .custom((value) => {
      const fromDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (fromDate < today) {
        throw new Error('From date must be today or in the future');
      }
      return true;
    }),
  body('toDate')
    .isISO8601()
    .withMessage('To date must be a valid date')
    .custom((value, { req }) => {
      const toDate = new Date(value);
      const fromDate = new Date(req.body.fromDate);
      if (toDate < fromDate) {
        throw new Error('To date must be after or equal to from date');
      }
      return true;
    }),
  body('semester')
    .isIn(['1', '2', '3', '4', '5', '6', '7', '8'])
    .withMessage('Semester must be between 1 and 8'),
  body('emergencyContact.name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Emergency contact name must be between 2 and 50 characters'),
  body('emergencyContact.phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Emergency contact phone must be a valid 10-digit number'),
  body('emergencyContact.relation')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Emergency contact relation must be between 2 and 20 characters')
];

const updateStatusValidation = [
  body('status')
    .isIn(['approved', 'rejected'])
    .withMessage('Status must be either approved or rejected'),
  body('facultyRemarks')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Faculty remarks cannot exceed 300 characters')
];

const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid leave request ID')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Status must be pending, approved, or rejected'),
  query('academicYear')
    .optional()
    .matches(/^\d{4}-\d{4}$/)
    .withMessage('Academic year must be in format YYYY-YYYY'),
  query('semester')
    .optional()
    .isIn(['1', '2', '3', '4', '5', '6', '7', '8'])
    .withMessage('Semester must be between 1 and 8'),
  query('department')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Department must be between 2 and 50 characters')
];

// @route   POST /api/leaves
// @desc    Create a new leave request
// @access  Private (Student)
router.post(
  '/',
  authenticate,
  authorize('student'),
  createLeaveValidation,
  createLeaveRequest
);

// @route   GET /api/leaves/my-requests
// @desc    Get all leave requests for current student
// @access  Private (Student)
router.get(
  '/my-requests',
  authenticate,
  authorize('student'),
  queryValidation,
  getMyLeaveRequests
);

// @route   GET /api/leaves
// @desc    Get all leave requests (Faculty/Admin)
// @access  Private (Faculty/Admin)
router.get(
  '/',
  authenticate,
  canManageLeaves,
  queryValidation,
  getAllLeaveRequests
);

// @route   GET /api/leaves/stats
// @desc    Get leave statistics
// @access  Private (Faculty/Admin)
router.get(
  '/stats',
  authenticate,
  canManageLeaves,
  queryValidation,
  getLeaveStats
);

// @route   GET /api/leaves/:id
// @desc    Get single leave request
// @access  Private
router.get(
  '/:id',
  authenticate,
  mongoIdValidation,
  validateLeaveOwnership,
  getLeaveRequest
);

// @route   PUT /api/leaves/:id/status
// @desc    Update leave request status
// @access  Private (Faculty/Admin)
router.put(
  '/:id/status',
  authenticate,
  canManageLeaves,
  mongoIdValidation,
  updateStatusValidation,
  updateLeaveStatus
);

// @route   DELETE /api/leaves/:id
// @desc    Delete leave request (Student only, if pending)
// @access  Private (Student)
router.delete(
  '/:id',
  authenticate,
  authorize('student'),
  mongoIdValidation,
  validateLeaveOwnership,
  deleteLeaveRequest
);

module.exports = router;
