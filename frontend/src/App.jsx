import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ManualAttendance from "./pages/ManualAttendance";
import CreateSemester from "./pages/CreateSemester";
import CreateSubject from "./pages/CreateSubject";
import StatisticsPage from "./pages/StatisticsPage";
import CalendarView from "./pages/CalendarView";
import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";
import RequireAuth from "./components/RequireAuth";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/mark-attendance" element={<ManualAttendance />} />
          <Route path="/add-semester" element={<CreateSemester />} />
          <Route path="/add-subject" element={<CreateSubject />} />
          <Route path="/stats" element={<StatisticsPage />} />
          <Route path="/calendar" element={<CalendarView />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}
