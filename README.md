# 🎓 CampusConnect

A full-stack MERN college portal with role-based access, smart notice board, and QR-powered event attendance tracking.

## 📋 Features

- **Authentication & Authorization** - JWT-based login/signup with role-based access control (Admin, Teacher, Student)
- **Notice Board** - Create, view, filter (by category), and delete notices with priority levels and deadlines
- **Event Management** - Create and manage events with seat limits and team-based registration support
- **QR Code Attendance** - Auto-generated QR codes on event registration; organizers scan to mark real-time attendance
- **Role-Based Dashboards** - Personalized views for Admin/Teacher/Student with recent notices preview
- **My Events** - Students can track events they've registered for
- **Profile Management** - Users can update their profile details

## 🛠️ Tech Stack

**Frontend:** React.js, React Router, Axios, HTML5-QRCode
**Backend:** Node.js, Express.js
**Database:** MongoDB (Mongoose)
**Authentication:** JWT, bcrypt

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Nilya575/CampusConnect.git
cd CampusConnect
```

2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Run the backend:
```bash
npm run dev
```

3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

4. Open `http://localhost:5173` in your browser

## 📸 Screenshots

*(Add screenshots here later)*

## 👤 Author

**Nilya Mishra**
- GitHub: [@Nilya575](https://github.com/Nilya575)