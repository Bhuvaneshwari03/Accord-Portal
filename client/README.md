# Student Leave Portal - Frontend

A modern React frontend for the Student Leave Portal built with Vite, Tailwind CSS, and React Router.

## Features

- **Authentication**: Login/Register with JWT token management
- **Role-based Access**: Different interfaces for Students, Faculty, and Admin
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Live data updates and notifications
- **Modern UI/UX**: Clean, intuitive interface with smooth animations

## Tech Stack

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Project Structure

```
src/
├── components/
│   ├── AuthForms.jsx      # Login/Register forms
│   ├── LeaveForm.jsx      # Leave request form
│   ├── LeaveList.jsx      # Leave requests list
│   └── Navbar.jsx         # Navigation bar
├── contexts/
│   └── AuthContext.jsx    # Authentication context
├── pages/
│   ├── Dashboard.jsx      # Main dashboard
│   ├── StudentPanel.jsx   # Student interface
│   └── FacultyPanel.jsx   # Faculty/Admin interface
├── services/
│   └── api.js            # API service layer
├── App.jsx               # Main app component
├── main.jsx              # App entry point
└── index.css             # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Configuration

The app connects to the backend API at `http://localhost:5000/api` by default. To change this, update the `baseURL` in `src/services/api.js`.

## Features Overview

### Authentication
- **Login/Register**: Secure authentication with JWT tokens
- **Role-based Access**: Different permissions for Students, Faculty, and Admin
- **Auto-logout**: Automatic logout on token expiration
- **Persistent Sessions**: Login state persists across browser sessions

### Student Features
- **Apply for Leave**: Submit leave and on-duty requests
- **View Requests**: Track status of submitted requests
- **Edit/Delete**: Modify or cancel pending requests
- **Dashboard**: Overview of request statistics

### Faculty/Admin Features
- **Review Requests**: View all student leave requests
- **Approve/Reject**: Process requests with remarks
- **Statistics**: Department-wise and overall analytics
- **Filtering**: Advanced filtering and search options

### UI/UX Features
- **Responsive Design**: Works on all device sizes
- **Dark/Light Mode**: Automatic theme detection
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Notifications**: Toast notifications for actions
- **Accessibility**: WCAG compliant components

## Component Documentation

### AuthForms
Combined login and registration form with validation.

**Props:** None (uses AuthContext)

**Features:**
- Form validation
- Password visibility toggle
- Role selection for registration
- Error handling

### LeaveForm
Form for submitting leave requests (Student only).

**Props:**
- `onSuccess`: Callback when request is submitted
- `onCancel`: Callback when form is cancelled

**Features:**
- Leave type selection (Leave/On-Duty)
- Date range picker with validation
- Emergency contact information
- Real-time form validation

### LeaveList
Displays leave requests with management options.

**Props:**
- `showAllRequests`: Boolean to show all requests (Faculty) or user's requests (Student)
- `onRequestUpdate`: Callback when request is updated
- `onRequestDelete`: Callback when request is deleted
- `refreshTrigger`: Number to trigger refresh

**Features:**
- Pagination
- Filtering and search
- Status management
- Detailed view modal

### Navbar
Responsive navigation with role-based menu items.

**Features:**
- User profile dropdown
- Role-based navigation
- Mobile responsive
- Logout functionality

## API Integration

The app uses Axios for HTTP requests with automatic token management:

```javascript
// Automatic token injection
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatic logout on 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## State Management

Uses React Context API for global state management:

- **AuthContext**: User authentication state
- **Local State**: Component-specific state with useState/useReducer

## Styling

Built with Tailwind CSS for rapid development:

- **Utility-first**: Rapid styling with utility classes
- **Responsive**: Mobile-first responsive design
- **Custom Components**: Reusable component classes
- **Animations**: Smooth transitions and animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License