import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TutorListing from './pages/TutorListing';
import TutorProfile from './pages/TutorProfile';
import MapView from './pages/MapView';
import Contact from './pages/Contact';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminPanel from './pages/AdminPanel';
import MyBookings from './pages/MyBookings';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tutors" element={<TutorListing />} />
          <Route path="/tutor/:id" element={<TutorProfile />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-bookings" element={<ProtectedRoute roles={['student']}><MyBookings /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute roles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: '12px', background: '#1e293b', color: '#fff', fontSize: '14px' }
      }} />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
