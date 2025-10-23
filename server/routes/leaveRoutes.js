import express from 'express';
import {
  applyLeave,
  getMyRequests,
  getPendingRequests,
  approveRequest,
  rejectRequest,
} from '../controllers/leaveController.js';
import { protect, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Student Routes
router.route('/apply').post(protect, checkRole(['student']), applyLeave);
router.route('/my-requests').get(protect, checkRole(['student']), getMyRequests);

// Faculty Routes
router.route('/pending').get(protect, checkRole(['faculty', 'admin']), getPendingRequests);
router.route('/approve/:id').put(protect, checkRole(['faculty', 'admin']), approveRequest);
router.route('/reject/:id').put(protect, checkRole(['faculty', 'admin']), rejectRequest);

export default router;