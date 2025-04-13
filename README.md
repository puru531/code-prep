# CodePrep

CodePrep is a learning platform for developers preparing for technical interviews. It offers a collection of courses and topics with markdown content for learning various programming concepts.

## Project Structure

This project consists of two main parts:

1. **Backend**: Node.js with Express and MongoDB
2. **Frontend**: Angular with TailwindCSS

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Angular CLI

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content (adjust as needed):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/codeprep
   JWT_SECRET=your_secure_jwt_secret_replace_in_production
   JWT_EXPIRATION=7d
   NODE_ENV=development
   ```

4. Seed the database with initial data:
   ```
   npm run data:import
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. The backend API will be available at http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The frontend application will be available at http://localhost:4200

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login an existing user
- `GET /api/auth/me` - Get current user profile (protected)

### Courses

- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get a single course
- `POST /api/courses` - Create a new course (admin only)
- `PUT /api/courses/:id` - Update a course (admin only)
- `DELETE /api/courses/:id` - Delete a course (admin only)
- `GET /api/courses/:id/topics` - Get all topics for a course

### Topics

- `GET /api/topics` - Get all topics
- `GET /api/topics/:id` - Get a single topic
- `POST /api/topics` - Create a new topic (admin only)
- `PUT /api/topics/:id` - Update a topic (admin only)
- `DELETE /api/topics/:id` - Delete a topic (admin only)
- `PUT /api/topics/:id/like` - Like or unlike a topic (protected)

### Users

- `GET /api/users/bookmarks` - Get user bookmarks (protected)
- `PUT /api/users/bookmarks/:id` - Bookmark or unbookmark a topic (protected)
- `GET /api/users/likes` - Get user liked topics (protected)
- `GET /api/users` - Get all users (admin only)

## Test Users

After seeding the database, the following test users will be available:

1. **Admin User**
   - Email: admin@codeprep.com
   - Password: admin123

2. **Regular User**
   - Email: user@codeprep.com  
   - Password: user123

## Technical Details

### Backend

- Express 5.1.0 for the web framework
- Mongoose 8.13.2 for MongoDB connectivity
- JWT for authentication
- bcryptjs for password hashing

### Frontend

- Angular (latest)
- TailwindCSS for styling
- Markdown rendering for topic content

## License

ISC