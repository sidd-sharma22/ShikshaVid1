# ShikshaVid 📚

> India's hyperlocal EdTech platform to discover the best-fit offline tutors near you.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Start MongoDB
```bash
mongod
```

### 2. Setup Server
```bash
cd server
npm install
npm run seed   # Load sample data
npm run dev    # Start on port 5000
```

### 3. Setup Client
```bash
cd client
npm install
npm run dev    # Start on port 5173
```

### 4. Open Browser
Visit `http://localhost:5173`

## 🔐 Demo Credentials

| Role    | Email                   | Password  |
|---------|-------------------------|-----------|
| Admin   | admin@shikshavid.com    | Admin@123 |
| Student | rahul@test.com          | Test@123  |
| Teacher | rajesh@test.com         | Test@123  |

## 📁 Project Structure

```
ShikshaVid-AG/
├── client/                    # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── TutorCard.jsx
│   │   ├── pages/             # Route pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── TutorListing.jsx
│   │   │   ├── TutorProfile.jsx
│   │   │   ├── MapView.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── index.html
│
├── server/                    # Node.js + Express
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Teacher.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   ├── Lead.js
│   │   └── Contact.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── teachers.js
│   │   ├── bookings.js
│   │   ├── reviews.js
│   │   ├── leads.js
│   │   ├── contact.js
│   │   └── admin.js
│   ├── utils/
│   │   ├── email.js
│   │   ├── scoring.js
│   │   └── seed.js
│   ├── server.js
│   └── .env
│
└── README.md
```

## 🏗️ API Endpoints

### Auth
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user

### Teachers
- `GET /api/teachers/search` - Search with best-fit scoring
- `GET /api/teachers/map` - Map markers
- `GET /api/teachers/:id` - Teacher profile
- `POST /api/teachers/profile` - Create profile (teacher)
- `PUT /api/teachers/profile` - Update profile (teacher)

### Bookings
- `POST /api/bookings` - Book demo class
- `GET /api/bookings/my-bookings` - Student bookings
- `GET /api/bookings/teacher-bookings` - Teacher bookings

### Reviews
- `POST /api/reviews` - Submit review
- `GET /api/reviews/teacher/:id` - Teacher reviews

### Admin
- `GET /api/admin/dashboard` - Analytics dashboard
- `GET /api/admin/teachers` - All teachers
- `PUT /api/admin/teachers/:id/approve` - Approve teacher
- `PUT /api/admin/teachers/:id/verify` - Verify teacher
- `GET /api/admin/revenue` - Revenue report

## 🧮 Best-Fit Score Algorithm

```
Score = (Experience × 30%) + (Rating × 30%) + (Distance × 20%) + (Fees × 20%)
```

- **Experience** (high weight): Normalized against 20 years max
- **Rating** (high weight): Out of 5 stars
- **Distance** (medium weight): Closer = higher score (30km max)
- **Fees** (medium weight): Lower fees = higher score

## ⚙️ Configuration

### Google Maps
Add your API key to `client/.env`:
```
VITE_GOOGLE_MAPS_KEY=your_key_here
```

### Email (Nodemailer)
Update `server/.env` with your Gmail credentials:
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 📱 Features

- ✅ JWT Authentication (Student/Teacher/Admin)
- ✅ Smart Best-Fit Teacher Recommendations
- ✅ Google Maps Integration
- ✅ Demo Class Booking with Email Notifications
- ✅ Reviews & Ratings System
- ✅ Lead Tracking (Call/WhatsApp/Booking)
- ✅ Full Admin Panel with Analytics
- ✅ Commission & Revenue Tracking
- ✅ Contact Form with Email
- ✅ Mobile-First Responsive Design
