const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const leaveRequestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  type: {
    type: String,
    enum: ['leave', 'on-duty'],
    required: [true, 'Leave type is required']
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  fromDate: {
    type: Date,
    required: [true, 'From date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date();
      },
      message: 'From date must be in the future'
    }
  },
  toDate: {
    type: Date,
    required: [true, 'To date is required'],
    validate: {
      validator: function(value) {
        return value >= this.fromDate;
      },
      message: 'To date must be after or equal to from date'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  facultyRemarks: {
    type: String,
    trim: true,
    maxlength: [300, 'Faculty remarks cannot exceed 300 characters']
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  // Additional fields for better tracking
  daysRequested: {
    type: Number,
    required: true,
    min: [1, 'Days requested must be at least 1']
  },
  academicYear: {
    type: String,
    required: true,
    default: function() {
      const currentYear = new Date().getFullYear();
      return `${currentYear}-${currentYear + 1}`;
    }
  },
  semester: {
    type: String,
    enum: ['1', '2', '3', '4', '5', '6', '7', '8'],
    required: true
  },
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    relation: {
      type: String,
      required: [true, 'Emergency contact relation is required'],
      trim: true
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
leaveRequestSchema.index({ studentId: 1 });
leaveRequestSchema.index({ status: 1 });
leaveRequestSchema.index({ fromDate: 1, toDate: 1 });
leaveRequestSchema.index({ academicYear: 1, semester: 1 });
leaveRequestSchema.index({ createdAt: -1 });

// Calculate days requested before saving
leaveRequestSchema.pre('save', function(next) {
  if (this.fromDate && this.toDate) {
    const timeDiff = this.toDate.getTime() - this.fromDate.getTime();
    this.daysRequested = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates
  }
  next();
});

// Virtual for checking if request is active (not expired)
leaveRequestSchema.virtual('isActive').get(function() {
  return this.status === 'pending' && this.fromDate > new Date();
});

// Instance method to check if dates conflict with existing requests
leaveRequestSchema.methods.checkDateConflict = async function() {
  const existingRequest = await this.constructor.findOne({
    studentId: this.studentId,
    status: { $in: ['pending', 'approved'] },
    _id: { $ne: this._id },
    $or: [
      {
        fromDate: { $lte: this.toDate },
        toDate: { $gte: this.fromDate }
      }
    ]
  });
  
  return existingRequest;
};

// Static method to get leave statistics for a student
leaveRequestSchema.statics.getStudentStats = async function(studentId, academicYear) {
  const stats = await this.aggregate([
    {
      $match: {
        studentId: new mongoose.Types.ObjectId(studentId),
        academicYear: academicYear || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalDays: { $sum: '$daysRequested' }
      }
    }
  ]);
  
  return stats;
};

// Add pagination plugin
leaveRequestSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
