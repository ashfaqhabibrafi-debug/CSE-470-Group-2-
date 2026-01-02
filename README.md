# Disaster Management and Volunteer Coordination System

A comprehensive full-stack web application built with MongoDB, Express.js, React, and Node.js for managing disasters, coordinating volunteers, and handling donations during emergency situations.

## Features

### Core Functionality
- ✅ User Registration & Login System (Citizen, Volunteer, Admin roles)
- ✅ Role-Based Access Control (RBAC)
- ✅ Profile Management with location support
- ✅ Disaster Reporting System with photo uploads
- ✅ Interactive Map Integration (Google Maps/Leaflet ready)
- ✅ Real-Time Disaster Feed
- ✅ Help Request System (food, water, shelter, medical, rescue)
- ✅ Volunteer Matching System based on location and skills
- ✅ Donation/Resource Management
- ✅ Event-Based Donation Campaigns
- ✅ Emergency Alerts/SOS System
- ✅ Chat/Messaging System
- ✅ News & Announcements Section
- ✅ Feedback & Review System
- ✅ Search & Filter System
- ✅ Notification Center
- ✅ Admin Dashboard capabilities
- ✅ Report Verification System
- ✅ Organization Management

## Project Structure

```
.
├── backend/                 # Express.js backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   ├── disasterController.js
│   │   ├── helpRequestController.js
│   │   ├── donationController.js
│   │   ├── donationEventController.js
│   │   ├── messageController.js
│   │   ├── feedbackController.js
│   │   ├── organizationController.js
│   │   └── announcementController.js
│   ├── middleware/         # Custom middleware
│   │   └── auth.js         # Authentication & authorization
│   ├── models/             # Mongoose models
│   │   ├── User.js
│   │   ├── Disaster.js
│   │   ├── HelpRequest.js
│   │   ├── Donation.js
│   │   ├── DonationEvent.js
│   │   ├── Message.js
│   │   ├── Feedback.js
│   │   ├── Organization.js
│   │   ├── Alert.js
│   │   └── Announcement.js
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   │   └── generateToken.js
│   └── server.js           # Entry point
├── frontend/               # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       └── services/
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn
- (Optional) Google Maps API key for map features
- (Optional) Email service credentials for notifications

## Installation

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/disaster-management

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=30d

# (Optional) Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# (Optional) Google Maps API Key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/disaster-management?retryWrites=true&w=majority
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

**Local MongoDB:**
```bash
mongod
```

Or use MongoDB Atlas (cloud) - just update the `MONGODB_URI` in your `.env` file.

## Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

### Start the Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user (citizen/volunteer/admin)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Protected)
- `PUT /api/users/:id` - Update user profile (Protected)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Disasters
- `GET /api/disasters` - Get all disasters (with filters: status, type, verified)
- `GET /api/disasters/nearby?longitude=&latitude=&maxDistance=` - Get nearby disasters
- `GET /api/disasters/:id` - Get single disaster
- `POST /api/disasters` - Create disaster report (Protected)
- `PUT /api/disasters/:id` - Update disaster (Protected)
- `PUT /api/disasters/:id/verify` - Verify/reject disaster (Admin only)
- `DELETE /api/disasters/:id` - Delete disaster (Admin only)

### Help Requests
- `GET /api/help-requests` - Get all help requests (with filters)
- `GET /api/help-requests/nearby?longitude=&latitude=` - Get nearby requests (Volunteer only)
- `GET /api/help-requests/:id` - Get single help request
- `POST /api/help-requests` - Create help request (Protected)
- `PUT /api/help-requests/:id/match` - Match volunteer to request (Volunteer only)
- `PUT /api/help-requests/:id/status` - Update request status (Protected)
- `DELETE /api/help-requests/:id` - Delete help request (Protected)

### Donations
- `GET /api/donations` - Get all donations (with filters)
- `GET /api/donations/:id` - Get single donation
- `POST /api/donations` - Create donation (Protected)
- `PUT /api/donations/:id/status` - Update donation status (Admin only)

### Donation Events
- `GET /api/donation-events` - Get all donation events
- `GET /api/donation-events/:id` - Get single event
- `POST /api/donation-events` - Create donation event (Admin only)
- `PUT /api/donation-events/:id` - Update event (Admin only)
- `DELETE /api/donation-events/:id` - Delete event (Admin only)

### Messages
- `GET /api/messages?receiver=&helpRequest=` - Get messages (Protected)
- `POST /api/messages` - Send message (Protected)
- `PUT /api/messages/:id/read` - Mark message as read (Protected)

### Feedback
- `GET /api/feedback?to=&helpRequest=` - Get feedback
- `POST /api/feedback` - Create feedback (Protected)
- `GET /api/feedback/rating/:userId` - Get user rating

### Organizations
- `GET /api/organizations` - Get all verified organizations
- `POST /api/organizations` - Create organization (Admin only)
- `PUT /api/organizations/:id` - Update organization (Admin only)

### Announcements
- `GET /api/announcements?category=` - Get published announcements
- `POST /api/announcements` - Create announcement (Admin only)
- `PUT /api/announcements/:id/publish` - Publish announcement (Admin only)

## User Roles

### Citizen
- Register and login
- Report disasters
- Request help
- Make donations
- Send/receive messages
- Leave feedback
- View announcements

### Volunteer
- All Citizen permissions
- View nearby help requests
- Match with help requests
- Update help request status
- Coordinate with citizens

### Admin
- All Volunteer permissions
- Verify/reject disaster reports
- Manage users
- Create donation events
- Manage organizations
- Create announcements
- View analytics
- Manage donations

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Socket.io (ready for real-time features)
- Multer (for file uploads)
- Nodemailer (for email notifications)
- Express Validator

### Frontend
- React
- Axios for API calls
- (To be added: React Router, Google Maps/Leaflet, Socket.io client)

## Database Models

### User
- Profile information with role-based access
- Location (geospatial coordinates)
- Skills (for volunteers)
- Verification status

### Disaster
- Title, description, type, severity
- Location (geospatial)
- Photos
- Status (pending, verified, active, resolved, rejected)
- Reported by, verified by

### HelpRequest
- Disaster reference
- Request types (food, water, shelter, medical, rescue)
- Urgency level
- Location (geospatial)
- Status and matching information

### Donation & DonationEvent
- Donation tracking
- Event-based campaigns
- Organization partnerships
- Collection statistics

### Message & Feedback
- Communication between users
- Rating and review system

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Protected routes
- Input validation
- Secure API endpoints

## Future Enhancements

- Real-time notifications with WebSocket
- Google Maps/Leaflet integration for map visualization
- Image upload handling with Multer
- Email notifications for alerts
- SMS notifications for critical alerts
- Analytics dashboard for admins
- AI-based disaster severity classification
- Integration with government emergency databases
- Mobile app support (React Native)

## Development

### Backend Scripts
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

### Frontend Scripts
- `npm start` - Start the development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Testing API Endpoints

### Example: Register a Citizen

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "citizen",
    "phone": "+1234567890",
    "address": {
      "city": "New York",
      "state": "NY",
      "country": "USA"
    }
  }'
```

### Example: Create Disaster Report

```bash
curl -X POST http://localhost:5000/api/disasters \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Flood in Downtown",
    "description": "Severe flooding in downtown area",
    "type": "flood",
    "severity": "high",
    "location": {
      "longitude": -74.006,
      "latitude": 40.7128,
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA"
    }
  }'
```

## Contributing

This is a project for CSE-470 course (Group-2).

**Team Members:**
- Rafi
- Tausif
- Simanto
- Ohona

## License

ISC

## Notes

- Ensure MongoDB is running before starting the server
- Change JWT_SECRET in production
- Configure email service for notification features
- Add Google Maps API key for map integration
- Set up file upload directory for images
- Configure Socket.io for real-time features
