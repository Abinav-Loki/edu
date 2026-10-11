import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CampusProvider, useCampus } from "./context/CampusContext";
import { SettingsProvider } from "./context/SettingsContext";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import TutorPage from "./pages/TutorPage";
import RecoveryPlanPage from "./pages/RecoveryPlanPage";
import QuizPage from "./pages/QuizPage";
import KnowledgePage from "./pages/KnowledgePage";
import ProgressPage from "./pages/ProgressPage";
import ResourcesPage from "./pages/ResourcesPage";
import CalendarPage from "./pages/CalendarPage";
import SettingsPage from "./pages/SettingsPage";
import FindMentorPage from "./pages/FindMentorPage";
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyTimetable from "./pages/faculty/FacultyTimetable";
import FacultyAvailability from "./pages/faculty/FacultyAvailability";
import FacultyStudents from "./pages/faculty/FacultyStudents";
import FacultyMentorRequests from "./pages/faculty/FacultyMentorRequests";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDataIntegrationPage from "./pages/admin/AdminDataIntegrationPage";
import AdminAtRiskPage from "./pages/admin/AdminAtRiskPage";
import AdminSegmentationPage from "./pages/admin/AdminSegmentationPage";
import SupportPage from "./pages/SupportPage";
import UploadMaterialsPage from "./pages/UploadMaterialsPage";
import LibraryPage from "./pages/LibraryPage";
import StudyPlannerPage from "./pages/StudyPlannerPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import LearningArenaPage from "./pages/LearningArenaPage";
import ShopPage from "./pages/ShopPage";
import { LearningProvider } from "./context/LearningContext";
import { SidebarProvider } from "./context/SidebarContext";
import LandingPage from "./pages/landing/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <CampusProvider>
      <SettingsProvider>
        <LearningProvider>
          <BrowserRouter>
            <SidebarProvider>
              <Routes>
              {/* Public Pre-Auth Route */}
              <Route path="/" element={<LandingPage />} />

              {/* Public Login & Signup Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<LoginPage />} />
              <Route path="/student/login" element={<LoginPage />} />
              <Route path="/student/signup" element={<LoginPage />} />
              <Route path="/faculty/login" element={<LoginPage />} />
              <Route path="/faculty/signup" element={<LoginPage />} />
              <Route path="/admin/login" element={<LoginPage />} />

              {/* Protected Main Routes */}
              <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                {/* Shared Profile */}
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

                {/* Student Routes */}
                <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["student"]}><HomePage /></ProtectedRoute>} />
                <Route path="/tutor" element={<ProtectedRoute allowedRoles={["student"]}><TutorPage /></ProtectedRoute>} />
                <Route path="/learning-arena" element={<ProtectedRoute allowedRoles={["student"]}><LearningArenaPage /></ProtectedRoute>} />
                <Route path="/shop" element={<ProtectedRoute allowedRoles={["student"]}><ShopPage /></ProtectedRoute>} />
                <Route path="/study-planner" element={<ProtectedRoute allowedRoles={["student"]}><StudyPlannerPage /></ProtectedRoute>} />
                <Route path="/recovery-plan" element={<ProtectedRoute allowedRoles={["student"]}><RecoveryPlanPage /></ProtectedRoute>} />
                <Route path="/quiz" element={<ProtectedRoute allowedRoles={["student"]}><QuizPage /></ProtectedRoute>} />
                <Route path="/knowledge" element={<ProtectedRoute allowedRoles={["student"]}><KnowledgePage /></ProtectedRoute>} />
                <Route path="/progress" element={<ProtectedRoute allowedRoles={["student"]}><ProgressPage /></ProtectedRoute>} />
                <Route path="/resources" element={<ProtectedRoute allowedRoles={["student"]}><ResourcesPage /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute allowedRoles={["student"]}><CalendarPage /></ProtectedRoute>} />
                <Route path="/find-mentor" element={<ProtectedRoute allowedRoles={["student"]}><FindMentorPage /></ProtectedRoute>} />
                <Route path="/library" element={<ProtectedRoute allowedRoles={["student"]}><LibraryPage /></ProtectedRoute>} />
                <Route path="/upload-materials" element={<ProtectedRoute allowedRoles={["student"]}><UploadMaterialsPage /></ProtectedRoute>} />
                
                {/* Shared Tickets (Student & Admin can view/edit in this demo setup for simplicity) */}
                <Route path="/support" element={<ProtectedRoute allowedRoles={["student", "admin"]}><SupportPage /></ProtectedRoute>} />

                {/* Faculty Routes (Accessible to Faculty & Campus Administrators) */}
                <Route path="/faculty" element={<ProtectedRoute allowedRoles={["faculty", "admin"]}><FacultyDashboard /></ProtectedRoute>} />
                <Route path="/faculty/timetable" element={<ProtectedRoute allowedRoles={["faculty", "admin"]}><FacultyTimetable /></ProtectedRoute>} />
                <Route path="/faculty/availability" element={<ProtectedRoute allowedRoles={["faculty", "admin"]}><FacultyAvailability /></ProtectedRoute>} />
                <Route path="/faculty/students" element={<ProtectedRoute allowedRoles={["faculty", "admin"]}><FacultyStudents /></ProtectedRoute>} />
                <Route path="/faculty/requests" element={<ProtectedRoute allowedRoles={["faculty", "admin"]}><FacultyMentorRequests /></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/data-integration" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDataIntegrationPage /></ProtectedRoute>} />
                <Route path="/admin/at-risk" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAtRiskPage /></ProtectedRoute>} />
                <Route path="/admin/segmentation" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSegmentationPage /></ProtectedRoute>} />
              </Route>

              {/* 404 Not Found for any unmatched route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </SidebarProvider>
          </BrowserRouter>
        </LearningProvider>
      </SettingsProvider>
    </CampusProvider>
  );
}
