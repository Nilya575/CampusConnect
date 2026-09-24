import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Notices from './pages/Notices';
import Events from './pages/Events';
import CreateNotice from './pages/CreateNotice';
import CreateEvent from './pages/CreateEvent';
import MyEvents from './pages/MyEvents';
import ScanAttendance from './pages/ScanAttendance';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/events" element={<Events />} />
        <Route path="/scan-attendance" element={
          <ProtectedRoute><ScanAttendance /></ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/create-notice" element={
          <ProtectedRoute><CreateNotice /></ProtectedRoute>
        } />
        <Route path="/create-event" element={
          <ProtectedRoute><CreateEvent /></ProtectedRoute>
        } />
        <Route path="/my-events" element={
          <ProtectedRoute><MyEvents /></ProtectedRoute>
        } />

        {/* Ye line yaha move ki, Routes ke ANDAR */}
        <Route path="/edit-profile" element={
          <ProtectedRoute><EditProfile /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;