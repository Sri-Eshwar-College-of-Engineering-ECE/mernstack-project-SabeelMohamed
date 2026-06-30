# Vending Machine Backend

Backend API for the Vending Machine application with MongoDB integration.

## Features

- User registration and authentication
- Admin login with predefined credentials
- JWT-based authentication
- Password hashing with bcrypt
- MongoDB database integration

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_uri_here
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
```

Replace `your_mongodb_uri_here` with your actual MongoDB connection string.

### 3. Seed Admin User

Run this command to create the admin user in the database:

```bash
node scripts/seedAdmin.js
```

This will create an admin user with:
- Email: sabeel@gmail.com
- Password: Sabeel@18
- Role: admin

### 4. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### 1. User Signup
- **POST** `/api/auth/signup`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "token": "jwt_token"
    }
  }
  ```

#### 2. User/Admin Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "sabeel@gmail.com",
    "password": "Sabeel@18"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "name": "Admin",
      "email": "sabeel@gmail.com",
      "role": "admin",
      "token": "jwt_token"
    }
  }
  ```

#### 3. Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection
├── middleware/
│   └── auth.js            # Authentication middleware
├── models/
│   └── User.js            # User model
├── routes/
│   └── auth.js            # Authentication routes
├── scripts/
│   └── seedAdmin.js       # Admin seeding script
├── utils/
│   └── generateToken.js   # JWT token generator
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
├── server.js              # Main server file
└── README.md
```

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables management
