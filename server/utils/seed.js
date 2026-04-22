const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Review = require('../models/Review');
const Booking = require('../models/Booking');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Teacher.deleteMany({});
    await Review.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data');

    // Create admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@shikshavid.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '9999999999'
    });
    console.log('Admin created');

    // Create students
    const students = await User.create([
      { name: 'Rahul Sharma', email: 'rahul@test.com', password: 'Test@123', role: 'student', phone: '9876543210' },
      { name: 'Priya Gupta', email: 'priya@test.com', password: 'Test@123', role: 'student', phone: '9876543211' },
      { name: 'Amit Kumar', email: 'amit@test.com', password: 'Test@123', role: 'student', phone: '9876543212' },
    ]);
    console.log('Students created');

    // Create teacher users
    const teacherUsers = await User.create([
      { name: 'Dr. Rajesh Verma', email: 'rajesh@test.com', password: 'Test@123', role: 'teacher', phone: '9812345001' },
      { name: 'Sunita Devi', email: 'sunita@test.com', password: 'Test@123', role: 'teacher', phone: '9812345002' },
      { name: 'Manoj Tiwari', email: 'manoj@test.com', password: 'Test@123', role: 'teacher', phone: '9812345003' },
      { name: 'Kavita Sharma', email: 'kavita@test.com', password: 'Test@123', role: 'teacher', phone: '9812345004' },
      { name: 'Ravi Prakash', email: 'ravi@test.com', password: 'Test@123', role: 'teacher', phone: '9812345005' },
      { name: 'Anjali Singh', email: 'anjali@test.com', password: 'Test@123', role: 'teacher', phone: '9812345006' },
      { name: 'Deepak Joshi', email: 'deepak@test.com', password: 'Test@123', role: 'teacher', phone: '9812345007' },
      { name: 'Neha Agarwal', email: 'neha@test.com', password: 'Test@123', role: 'teacher', phone: '9812345008' },
    ]);
    console.log('Teacher users created');

    // Create teacher profiles (Jaipur area locations)
    const teachers = await Teacher.create([
      {
        userId: teacherUsers[0]._id,
        subjects: ['Mathematics', 'Physics'],
        experience: 15,
        fees: 3000,
        location: { type: 'Point', coordinates: [75.7873, 26.9124], address: 'C-Scheme, Jaipur', city: 'Jaipur' },
        bio: 'PhD in Mathematics with 15 years of teaching experience. Specializes in IIT-JEE preparation.',
        qualifications: ['PhD Mathematics', 'M.Sc Physics', 'B.Ed'],
        demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        rating: 4.8, totalReviews: 24, isVerified: true, isApproved: true,
        teachingMode: 'offline', languages: ['Hindi', 'English'],
        totalLeads: 45, callClicks: 20, whatsappClicks: 15, demoBookings: 10, enrolledStudents: 8
      },
      {
        userId: teacherUsers[1]._id,
        subjects: ['English', 'Hindi'],
        experience: 8,
        fees: 2000,
        location: { type: 'Point', coordinates: [75.8010, 26.9200], address: 'Vaishali Nagar, Jaipur', city: 'Jaipur' },
        bio: 'Experienced language teacher. Makes learning fun and interactive.',
        qualifications: ['MA English', 'B.Ed'],
        rating: 4.5, totalReviews: 18, isVerified: true, isApproved: true,
        teachingMode: 'both', languages: ['Hindi', 'English'],
        totalLeads: 30, callClicks: 12, whatsappClicks: 10, demoBookings: 8, enrolledStudents: 5
      },
      {
        userId: teacherUsers[2]._id,
        subjects: ['Chemistry', 'Biology'],
        experience: 12,
        fees: 2500,
        location: { type: 'Point', coordinates: [75.7700, 26.8900], address: 'Malviya Nagar, Jaipur', city: 'Jaipur' },
        bio: 'NEET specialist. 200+ students selected in medical colleges.',
        qualifications: ['M.Sc Chemistry', 'B.Ed'],
        rating: 4.7, totalReviews: 32, isVerified: true, isApproved: true,
        teachingMode: 'offline', languages: ['Hindi', 'English'],
        totalLeads: 55, callClicks: 25, whatsappClicks: 18, demoBookings: 12, enrolledStudents: 10
      },
      {
        userId: teacherUsers[3]._id,
        subjects: ['Mathematics', 'Science'],
        experience: 6,
        fees: 1500,
        location: { type: 'Point', coordinates: [75.8200, 26.9300], address: 'Mansarovar, Jaipur', city: 'Jaipur' },
        bio: 'Young and energetic teacher for classes 6-10. Board exam preparation.',
        qualifications: ['B.Sc Mathematics', 'B.Ed'],
        rating: 4.3, totalReviews: 12, isApproved: true,
        teachingMode: 'offline', languages: ['Hindi'],
        totalLeads: 18, callClicks: 8, whatsappClicks: 5, demoBookings: 5, enrolledStudents: 3
      },
      {
        userId: teacherUsers[4]._id,
        subjects: ['Computer Science', 'Mathematics'],
        experience: 10,
        fees: 3500,
        location: { type: 'Point', coordinates: [75.7500, 26.9050], address: 'Raja Park, Jaipur', city: 'Jaipur' },
        bio: 'Software engineer turned teacher. Expert in programming and competitive math.',
        qualifications: ['M.Tech CS', 'B.Ed'],
        rating: 4.6, totalReviews: 15, isVerified: true, isApproved: true,
        teachingMode: 'both', languages: ['Hindi', 'English'],
        totalLeads: 35, callClicks: 15, whatsappClicks: 12, demoBookings: 8, enrolledStudents: 6
      },
      {
        userId: teacherUsers[5]._id,
        subjects: ['Social Studies', 'Hindi'],
        experience: 20,
        fees: 1800,
        location: { type: 'Point', coordinates: [75.7600, 26.8800], address: 'Jagatpura, Jaipur', city: 'Jaipur' },
        bio: 'Veteran teacher with expertise in UPSC foundation and board exams.',
        qualifications: ['MA History', 'MA Political Science', 'B.Ed'],
        rating: 4.9, totalReviews: 40, isVerified: true, isApproved: true,
        teachingMode: 'offline', languages: ['Hindi'],
        totalLeads: 60, callClicks: 28, whatsappClicks: 20, demoBookings: 12, enrolledStudents: 12
      },
      {
        userId: teacherUsers[6]._id,
        subjects: ['Physics', 'Mathematics'],
        experience: 4,
        fees: 1200,
        location: { type: 'Point', coordinates: [75.8100, 26.9400], address: 'Vidhyadhar Nagar, Jaipur', city: 'Jaipur' },
        bio: 'IIT graduate passionate about teaching. Affordable quality education.',
        qualifications: ['B.Tech IIT Delhi'],
        rating: 4.2, totalReviews: 8, isApproved: true,
        teachingMode: 'both', languages: ['Hindi', 'English'],
        totalLeads: 12, callClicks: 5, whatsappClicks: 4, demoBookings: 3, enrolledStudents: 2
      },
      {
        userId: teacherUsers[7]._id,
        subjects: ['English', 'French'],
        experience: 9,
        fees: 2800,
        location: { type: 'Point', coordinates: [75.7950, 26.9000], address: 'Tonk Road, Jaipur', city: 'Jaipur' },
        bio: 'Language expert. IELTS and TOEFL preparation specialist.',
        qualifications: ['MA English Literature', 'DELF B2 French'],
        rating: 4.4, totalReviews: 20, isVerified: true, isApproved: true,
        teachingMode: 'both', languages: ['Hindi', 'English', 'French'],
        totalLeads: 25, callClicks: 10, whatsappClicks: 8, demoBookings: 7, enrolledStudents: 4
      }
    ]);
    console.log('Teacher profiles created');

    // Create sample reviews
    const reviewData = [];
    for (const teacher of teachers) {
      for (let i = 0; i < Math.min(students.length, 2); i++) {
        reviewData.push({
          studentId: students[i]._id,
          teacherId: teacher._id,
          rating: 4 + Math.random(),
          comment: [
            'Excellent teacher! Very patient and explains concepts clearly.',
            'Great teaching methodology. My marks improved significantly.',
            'Highly recommended for board exam preparation.',
          ][i % 3]
        });
      }
    }
    // Only create unique student-teacher combos
    for (const r of reviewData) {
      try {
        await Review.create(r);
      } catch(e) { /* skip duplicates */ }
    }
    console.log('Reviews created');

    // Create sample bookings
    await Booking.create([
      { studentId: students[0]._id, teacherId: teachers[0]._id, date: new Date('2026-04-25'), time: '10:00 AM', status: 'confirmed', subject: 'Mathematics', studentName: 'Rahul Sharma', studentEmail: 'rahul@test.com' },
      { studentId: students[1]._id, teacherId: teachers[2]._id, date: new Date('2026-04-26'), time: '4:00 PM', status: 'pending', subject: 'Chemistry', studentName: 'Priya Gupta', studentEmail: 'priya@test.com' },
      { studentId: students[2]._id, teacherId: teachers[4]._id, date: new Date('2026-04-27'), time: '11:00 AM', status: 'pending', subject: 'Computer Science', studentName: 'Amit Kumar', studentEmail: 'amit@test.com' },
    ]);
    console.log('Bookings created');

    console.log('\n=== SEED DATA COMPLETE ===');
    console.log('Admin: admin@shikshavid.com / Admin@123');
    console.log('Student: rahul@test.com / Test@123');
    console.log('Teacher: rajesh@test.com / Test@123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
