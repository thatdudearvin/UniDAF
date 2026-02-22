import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { UserRole } from './types/auth';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import Enrollments from './pages/admin/Enrollments';
import Users from './pages/admin/Users';
import Reports from './pages/admin/Reports';

// Student
import StudentDashboard from './pages/student/Dashboard';
import StudentLayout from './pages/student/StudentLayout';
import Attendance from './pages/student/Attendance';
import Grades from './pages/student/Grades';
import Schedule from './pages/student/Schedule';

//Teacher
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherLayout from './pages/teacher/TeacherLayout';
import Classes from './pages/teacher/Classes';
import GradeEntry from './pages/teacher/Grade';
import AttendanceRecord from './pages/teacher/Attendance';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/*-----student----- */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="grades" element={<Grades />} />
          <Route path="schedule" element={<Schedule />} />
        </Route>

        {/*------TEACHER-----*/}
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute allowedRoles={[UserRole.TEACHING_STAFF]}>
              <TeacherLayout />
              <TeacherDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="classes" element={<Classes />} />
          <Route path="grade-entry" element={<GradeEntry />} />
          <Route path="attendance" element={<AttendanceRecord />} />
        </Route>

        {/*-----ADMIN-----*/}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[UserRole.NON_TEACHING_STAFF, UserRole.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="enrollments" element={<Enrollments />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;