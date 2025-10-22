# Student Leave Portal - Backend API

A comprehensive Node.js + Express backend for managing student leave requests with role-based access control.

## Features

- **User Management**: Student, Faculty, and Admin roles
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Leave Management**: Create, view, approve/reject leave requests
- **Role-based Access Control**: Different permissions for different user types
- **Data Validation**: Comprehensive input validation using express-validator
- **Error Handling**: Centralized error handling with detailed error messages
- **MongoDB Integration**: Mongoose ODM with proper indexing and relationships

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Environment**: dotenv

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/profile` | Get current user profile | Private |
| PUT | `/profile` | Update user profile | Private |
| PUT | `/change-password` | Change user password | Private |

### Leave Management Routes (`/api/leaves`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/` | Create leave request | Student |
| GET | `/my-requests` | Get my leave requests | Student |
| GET | `/` | Get all leave requests | Faculty/Admin |
| GET | `/stats` | Get leave statistics | Faculty/Admin |
| GET | `/:id` | Get single leave request | Private |
| PUT | `/:id/status` | Update leave status | Faculty/Admin |
| DELETE | `/:id` | Delete leave request | Student |

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/student-leave-portal

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=7d

# Client Configuration
CLIENT_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Start MongoDB

Make sure MongoDB is running on your system. You can use:
- Local MongoDB installation
- MongoDB Atlas (cloud)
- Docker: `docker run -d -p 27017:27017 --name mongodb mongo`

### 4. Run the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## Data Models

### User Model
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  role: String (enum: 'student', 'faculty', 'admin'),
  department: String (required, 2-50 chars),
  studentId: String (unique for students, auto-generated),
  isActive: Boolean (default: true)
}
```

### LeaveRequest Model
```javascript
{
  studentId: ObjectId (ref: User),
  type: String (enum: 'leave', 'on-duty'),
  reason: String (required, 10-500 chars),
  fromDate: Date (required, future date),
  toDate: Date (required, >= fromDate),
  status: String (enum: 'pending', 'approved', 'rejected'),
  facultyRemarks: String (max 300 chars),
  reviewedBy: ObjectId (ref: User),
  reviewedAt: Date,
  daysRequested: Number (calculated),
  academicYear: String (auto-generated),
  semester: String (enum: '1'-'8'),
  emergencyContact: {
    name: String (required),
    phone: String (required, 10 digits),
    relation: String (required)
  }
}
```

## Sample API Usage

### Register a Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@student.com",
    "password": "password123",
    "role": "student",
    "department": "Computer Science",
    "studentId": "STU2024001"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@student.com",
    "password": "password123"
  }'
```

### Create Leave Request
```bash
curl -X POST http://localhost:5000/api/leaves \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "leave",
    "reason": "Family emergency - need to attend to urgent family matter",
    "fromDate": "2024-02-15",
    "toDate": "2024-02-17",
    "semester": "6",
    "emergencyContact": {
      "name": "Jane Doe",
      "phone": "9876543210",
      "relation": "Sister"
    }
  }'
```

## Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors (if any)
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Request rate limiting (can be added)

## Development Notes

- All routes are protected except registration and login
- Students can only access their own leave requests
- Faculty and Admin can view all leave requests
- Only Faculty and Admin can approve/reject requests
- Comprehensive validation on all inputs
- Proper error handling and logging
- Database indexes for optimal performance

## License

ISC
