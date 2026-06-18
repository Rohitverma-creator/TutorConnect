import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "./components/Header";
import Tutors from "./pages/Tutors";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MySession from "./pages/MySession";
import Home from "./pages/Home";
import StudentRegister from "./pages/StudentRegister";
import StudentLogin from "./pages/StudentLogin";

import useGetCurrentUser from "./hooks/UseGetCurrentUser";
import TutorLogin from "./pages/TutorLogin";
import TutorSignUp from "./pages/TutorSignUp";
import TutorDashboard from "./components/TutorDashboard";
import useGetCurrentTutor from "./hooks/UseGetCurrentTutor";
import TeacherInterview from "./pages/TeacherInterview";
import ViewResult from "./pages/ViewResult";
import useGetAllTeacher from "./hooks/UseGetAllTeacher";
import StudentBookingPage from "./pages/StudentBookingPage";
import ConfirmedBooking from "./pages/ConfirmedBooking";
import TutorBooking from "./pages/TutorBooking";
import ValidProof from "./pages/ValidProof";
import UploadProblemPage from "./pages/UploadProblemPage";
import FeedbackPage from "./pages/FeedbackPage";
import ViewTutorProfile from "./pages/ViewTutorProfile";
import TutorProfile from "./components/TutorProfile";
import EmergencyComponent from "./components/EmergencyComponent";
import TutorEmergencyRequest from "./components/TutorEmergencyRequest";
import TimetablePage from "./components/TimeTablePage";
import EmergencySessionHistory from "./pages/EmergencySessionHistory";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Sessions from "./pages/admin/Sessions";
import Payment from "./pages/admin/Payment";
import Feedbacks from "./pages/admin/Feedback";
import SmartTutor from "./pages/SmartTutor";

export const backendUrl = "http://localhost:8000";

const App = () => {
  useGetCurrentUser();
  useGetCurrentTutor();
  useGetAllTeacher();

  const user = useSelector((state) => state.user.user);
  const tutor = useSelector((state) => state.tutor.tutor);
  const isAuthenticated = user || tutor;

  return (
    <main>
      <Routes>
        {/* --- Public / Guest Routes --- */}
        <Route
          path="/student-register"
          element={!user ? <StudentRegister /> : <Navigate to="/" />}
        />
        <Route
          path="/student-login"
          element={!user ? <StudentLogin /> : <Navigate to="/" />}
        />
        <Route
          path="/tutor-login"
          element={!tutor ? <TutorLogin /> : <Navigate to="/tutor-dashboard" />}
        />
        <Route
          path="/tutor-register"
          element={
            !tutor ? <TutorSignUp /> : <Navigate to="/tutor-dashboard" />
          }
        />

        {/* --- Student Protected Routes --- */}
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/student-login" />}
        />
        <Route
          path="/tutor"
          element={user ? <Tutors /> : <Navigate to="/student-login" />}
        />
        <Route
          path="/blog"
          element={user ? <Blog /> : <Navigate to="/student-login" />}
        />
        <Route
          path="/contact"
          element={user ? <Contact /> : <Navigate to="/student-login" />}
        />
        <Route
          path="/my-profile"
          element={user ? <MyProfile /> : <Navigate to="/student-login" />}
        />

        <Route
          path="/book-student-session"
          element={
            user ? <StudentBookingPage /> : <Navigate to="/student-login" />
          }
        />
        <Route
          path="/view-tutor/:id"
          element={
            user ? <ViewTutorProfile /> : <Navigate to="/student-login" />
          }
        />

        <Route path="/smart-tutor" element={<SmartTutor />} />

        <Route path="/feedback/:bookingId" element={<FeedbackPage />} />
        <Route
          path="/confirmed-booking"
          element={
            user ? <ConfirmedBooking /> : <Navigate to="/student-login" />
          }
        />
        <Route
          path="/my-session"
          element={user ? <MySession /> : <Navigate to="/student-login" />}
        />

        {/* --- Tutor Protected Routes --- */}
        <Route
          path="/tutor-dashboard"
          element={tutor ? <TutorDashboard /> : <Navigate to="/tutor-login" />}
        />
        <Route
          path="/tutor-booking"
          element={tutor ? <TutorBooking /> : <Navigate to="/tutor-login" />}
        />
        <Route
          path="/ai-interview"
          element={
            tutor ? <TeacherInterview /> : <Navigate to="/tutor-login" />
          }
        />
        <Route
          path="/view-result"
          element={tutor ? <ViewResult /> : <Navigate to="/tutor-login" />}
        />

        <Route
          path="/proof-validation/:id"
          element={
            isAuthenticated ? <ValidProof /> : <Navigate to="/student-login" />
          }
        />
        <Route
          path="/emergency"
          element={
            user ? <EmergencyComponent /> : <Navigate to="/student-login" />
          }
        />

        <Route
          path="/upload-problem"
          element={
            user ? <UploadProblemPage /> : <Navigate to="/student-login" />
          }
        />
        <Route
          path="/tutor-profile"
          element={tutor ? <TutorProfile /> : <Navigate to="/tutor-login" />}
        />

        <Route
          path="/tutor-emergency"
          element={
            tutor ? <TutorEmergencyRequest /> : <Navigate to="/tutor-login" />
          }
        />

        <Route path="/emergency-session-history" element={<EmergencySessionHistory />} />

        <Route path="/time-table" element={<TimetablePage/>}/>


      {/*Admin Routes*/}
      <Route path="/admin-login" element={<AdminLogin/>}/>
      <Route path="/admin-dashboard" element={<Dashboard/>}/>
      <Route path="/admin-sessions" element={<Sessions/>}/>
      <Route path="/admin-payments" element={<Payment/>}/>
      <Route path="/admin-feedbacks" element={<Feedbacks/>}/>
      <Route path="*" element={<Navigate to="/" />} />


      </Routes>
    </main>
  );
};

export default App;
