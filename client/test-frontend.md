# Frontend Testing Guide

## Manual Testing Checklist

### 1. Authentication Flow
- [ ] **Registration**
  - Navigate to `/register`
  - Fill out registration form with valid data
  - Verify successful registration and auto-login
  - Test validation for required fields
  - Test email format validation
  - Test password length validation

- [ ] **Login**
  - Navigate to `/login`
  - Enter valid credentials
  - Verify successful login and redirect to dashboard
  - Test invalid credentials error handling
  - Test empty form validation

- [ ] **Logout**
  - Click logout button in navbar
  - Verify redirect to login page
  - Verify token removal from localStorage

### 2. Student Features
- [ ] **Dashboard**
  - Verify student dashboard loads correctly
  - Check welcome message and user info
  - Verify quick stats display
  - Check recent requests section

- [ ] **Apply for Leave**
  - Navigate to Student Panel
  - Click "Apply for Leave" or "New Request"
  - Fill out leave form with valid data
  - Test date validation (future dates only)
  - Test emergency contact validation
  - Submit form and verify success message
  - Verify redirect to requests list

- [ ] **View My Requests**
  - Navigate to "My Requests" tab
  - Verify requests list displays correctly
  - Test filtering by status
  - Test search functionality
  - Click on request to view details
  - Test delete functionality for pending requests

### 3. Faculty/Admin Features
- [ ] **Dashboard**
  - Verify faculty dashboard loads correctly
  - Check statistics cards
  - Verify approval rate calculations
  - Check department statistics table

- [ ] **All Requests Management**
  - Navigate to Faculty Panel
  - Verify all requests list displays
  - Test filtering by department, status, type
  - Test search functionality
  - Click on request to view full details
  - Test approve/reject functionality
  - Verify faculty remarks functionality

### 4. Responsive Design
- [ ] **Mobile View**
  - Test on mobile device or browser dev tools
  - Verify navbar collapses correctly
  - Check form layouts on small screens
  - Test table responsiveness
  - Verify modal displays correctly

- [ ] **Tablet View**
  - Test on tablet-sized screens
  - Verify grid layouts adapt correctly
  - Check navigation usability

- [ ] **Desktop View**
  - Test on large screens
  - Verify all features work correctly
  - Check hover states and interactions

### 5. Error Handling
- [ ] **Network Errors**
  - Disconnect internet and test API calls
  - Verify error messages display correctly
  - Test retry functionality

- [ ] **Validation Errors**
  - Submit forms with invalid data
  - Verify field-specific error messages
  - Test real-time validation

- [ ] **Authentication Errors**
  - Test with expired tokens
  - Verify automatic logout on 401 errors
  - Test protected route access

### 6. Performance
- [ ] **Loading States**
  - Verify loading spinners display during API calls
  - Test skeleton screens where applicable
  - Check for smooth transitions

- [ ] **Data Updates**
  - Test real-time data updates
  - Verify refresh functionality
  - Check pagination performance

## Browser Testing

Test the application in the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Accessibility Testing

- [ ] **Keyboard Navigation**
  - Test tab navigation through forms
  - Verify focus indicators are visible
  - Test keyboard shortcuts

- [ ] **Screen Reader**
  - Test with screen reader software
  - Verify proper ARIA labels
  - Check form field descriptions

- [ ] **Color Contrast**
  - Verify sufficient color contrast
  - Test with color blindness simulators

## API Integration Testing

### Test with Backend Running
1. Start the backend server (`npm run dev` in server directory)
2. Start the frontend (`npm run dev` in client directory)
3. Test all CRUD operations
4. Verify data persistence
5. Test real-time updates

### Test API Endpoints
- [ ] `POST /api/auth/register` - User registration
- [ ] `POST /api/auth/login` - User login
- [ ] `GET /api/auth/profile` - Get user profile
- [ ] `POST /api/leaves` - Create leave request
- [ ] `GET /api/leaves/my-requests` - Get student requests
- [ ] `GET /api/leaves` - Get all requests (faculty)
- [ ] `PUT /api/leaves/:id/status` - Update request status
- [ ] `DELETE /api/leaves/:id` - Delete request
- [ ] `GET /api/leaves/stats` - Get statistics

## Common Issues to Check

1. **Token Management**
   - Verify tokens are stored securely
   - Check token refresh handling
   - Test logout token cleanup

2. **Form Validation**
   - Test client-side validation
   - Verify server-side error handling
   - Check real-time validation feedback

3. **State Management**
   - Verify context state updates
   - Test component re-renders
   - Check data consistency

4. **Navigation**
   - Test route protection
   - Verify role-based access
   - Check browser back/forward buttons

## Performance Metrics

- [ ] **Page Load Time** < 3 seconds
- [ ] **Time to Interactive** < 5 seconds
- [ ] **Bundle Size** < 1MB (gzipped)
- [ ] **Lighthouse Score** > 90

## Security Testing

- [ ] **XSS Prevention**
  - Test input sanitization
  - Verify no script injection

- [ ] **CSRF Protection**
  - Verify token validation
  - Test cross-origin requests

- [ ] **Data Exposure**
  - Check for sensitive data in localStorage
  - Verify proper error messages (no stack traces)

## Deployment Testing

- [ ] **Production Build**
  - Test `npm run build`
  - Verify build optimization
  - Check for console errors

- [ ] **Environment Variables**
  - Test different API endpoints
  - Verify configuration management

## User Experience Testing

- [ ] **Intuitive Navigation**
  - Test user flow completion
  - Verify clear call-to-actions
  - Check error message clarity

- [ ] **Visual Design**
  - Verify consistent styling
  - Test dark/light mode (if applicable)
  - Check icon usage

- [ ] **Feedback Systems**
  - Test success/error notifications
  - Verify loading states
  - Check confirmation dialogs
