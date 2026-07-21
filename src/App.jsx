// // // import { Routes, Route } from "react-router-dom";
// // // import {
// // //   TbBuilding,
// // //   TbFileText,
// // //   TbCalendarEvent,
// // //   TbSettings,
// // //   TbChartBar,
// // //   TbUser,
// // // } from "react-icons/tb";
// // // import DashboardLayout from "./components/layout/DashboardLayout";
// // // import Dashboard from "./pages/Dashboard";
// // // import JobListings from "./pages/JobListings";
// // // import Candidates from "./pages/Candidates";
// // // import Messages from "./pages/Messages";
// // // import Placeholder from "./pages/Placeholder";
// // // import Login from "./pages/Login";
// // // import ForgotPassword from "./pages/ForgotPassword";
// // // import Profile from "./pages/Profile";
// // // import { ThemeProvider } from "./context/ThemeContext";
// // // import { ToastProvider } from "./context/ToastContext";
// // // import { AuthProvider, ProtectedRoute } from "./context/AuthContext";
// // // import MessageToggle from "./components/ui/MessageToggle";

// // // export default function App() {
// // //   return (
// // //     <ThemeProvider>
// // //       <ToastProvider>
// // //         <AuthProvider>
// // //           <Routes>
// // //             {/* Auth Routes - No Layout */}
// // //             <Route path="/login" element={<Login />} />
// // //             <Route path="/forgot-password" element={<ForgotPassword />} />

// // //             {/* Protected Routes - With Layout */}
// // //             <Route
// // //               path="/"
// // //               element={
// // //                 <ProtectedRoute>
// // //                   <DashboardLayout />
// // //                 </ProtectedRoute>
// // //               }
// // //             >
// // //               <Route index element={<Dashboard />} />
// // //               <Route path="jobs" element={<JobListings />} />
// // //               <Route path="candidates" element={<Candidates />} />
// // //               <Route path="messages" element={<Messages />} />
// // //               <Route path="profile" element={<Profile />} />
// // //               <Route
// // //                 path="companies"
// // //                 element={<Placeholder title="Companies" icon={TbBuilding} />}
// // //               />
// // //               <Route
// // //                 path="applications"
// // //                 element={<Placeholder title="Applications" icon={TbFileText} />}
// // //               />
// // //               <Route
// // //                 path="interviews"
// // //                 element={
// // //                   <Placeholder title="Interviews" icon={TbCalendarEvent} />
// // //                 }
// // //               />
// // //               <Route
// // //                 path="settings"
// // //                 element={<Placeholder title="Settings" icon={TbSettings} />}
// // //               />
// // //               <Route
// // //                 path="reports"
// // //                 element={<Placeholder title="Reports" icon={TbChartBar} />}
// // //               />
// // //             </Route>
// // //           </Routes>
// // //           <MessageToggle />
// // //         </AuthProvider>
// // //       </ToastProvider>
// // //     </ThemeProvider>
// // //   );
// // // }

// // import { Routes, Route } from "react-router-dom";
// // import {
// //   TbBuilding,
// //   TbFileText,
// //   TbCalendarEvent,
// //   TbSettings,
// //   TbChartBar,
// //   TbUser,
// // } from "react-icons/tb";
// // import DashboardLayout from "./components/layout/DashboardLayout";
// // import Dashboard from "./pages/Dashboard";
// // // import JobListings from "./pages/JobListings";
// // import Candidates from "./pages/Candidates";
// // import Messages from "./pages/Messages";
// // import Placeholder from "./pages/Placeholder";
// // import Login from "./pages/Login";
// // import ForgotPassword from "./pages/ForgotPassword";
// // import Profile from "./pages/Profile";
// // import { ThemeProvider } from "./context/ThemeContext";
// // import { ToastProvider } from "./context/ToastContext";
// // import { AuthProvider, ProtectedRoute, useAuth } from "./context/AuthContext";
// // import MessageToggle from "./components/ui/MessageToggle";

// // import JobPost from './pages/JobPost/JobPost';
// // import joblistings from './pages/JobListing/JobListings';

// // // Wrapper to conditionally show MessageToggle
// // function MessageToggleWrapper() {
// //   const { isAuthenticated } = useAuth();
// //   if (!isAuthenticated) return null;
// //   return <MessageToggle />;
// // }

// // export default function App() {
// //   return (
// //     <ThemeProvider>
// //       <ToastProvider>
// //         <AuthProvider>
// //           <Routes>
// //             {/* Auth Routes - No Layout */}
// //             <Route path="/login" element={<Login />} />
// //             <Route path="/forgot-password" element={<ForgotPassword />} />

// //             {/* Protected Routes - With Layout */}
// //             <Route
// //               path="/"
// //               element={
// //                 <ProtectedRoute>
// //                   <DashboardLayout />
// //                 </ProtectedRoute>
// //               }
// //             >
// //               <Route index element={<Dashboard />} />
// //               {/* <Route path="jobs" element={<JobListings />} /> */}
// //               <Route path="jobs" element={<JobListings />} />

// //               <Route path="candidates" element={<Candidates />} />
// //               <Route path="messages" element={<Messages />} />
// //               <Route path="profile" element={<Profile />} />
// //               <Route
// //                 path="companies"
// //                 element={<Placeholder title="Companies" icon={TbBuilding} />}
// //               />
// //               <Route
// //                 path="applications"
// //                 element={<Placeholder title="Applications" icon={TbFileText} />}
// //               />
// //               <Route
// //                 path="interviews"
// //                 element={
// //                   <Placeholder title="Interviews" icon={TbCalendarEvent} />
// //                 }
// //               />
// //               <Route
// //                 path="settings"
// //                 element={<Placeholder title="Settings" icon={TbSettings} />}
// //               />
// //               <Route
// //                 path="reports"
// //                 element={<Placeholder title="Reports" icon={TbChartBar} />}
// //               />
// //             </Route>

// //             <Route path="job-post" element={<JobPost />} />

// //           </Routes>
// //           {/* Show MessageToggle only when authenticated */}
// //           <MessageToggleWrapper />
// //         </AuthProvider>
// //       </ToastProvider>
// //     </ThemeProvider>
// //   );
// // }

// import { Routes, Route } from "react-router-dom";
// import {
//   TbBuilding,
//   TbFileText,
//   TbCalendarEvent,
//   TbSettings,
//   TbChartBar,
//   TbUser,
// } from "react-icons/tb";
// import DashboardLayout from "./components/layout/DashboardLayout";
// import Dashboard from "./pages/Dashboard";
// import Candidates from "./pages/Candidates";
// import Messages from "./pages/Messages";
// import Placeholder from "./pages/Placeholder";
// import Login from "./pages/Login";
// import ForgotPassword from "./pages/ForgotPassword";
// import Profile from "./pages/Profile";
// import { ThemeProvider } from "./context/ThemeContext";
// import { ToastProvider } from "./context/ToastContext";
// import { AuthProvider, ProtectedRoute, useAuth } from "./context/AuthContext";
// import MessageToggle from "./components/ui/MessageToggle";

// import JobPost from './pages/JobPost/JobPost';
// import JobListings from './pages/JobListing/JobListings'; // Fixed: Capital 'J'

// // Wrapper to conditionally show MessageToggle
// function MessageToggleWrapper() {
//   const { isAuthenticated } = useAuth();
//   if (!isAuthenticated) return null;
//   return <MessageToggle />;
// }

// export default function App() {
//   return (
//     <ThemeProvider>
//       <ToastProvider>
//         <AuthProvider>
//           <Routes>
//             {/* Auth Routes - No Layout */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />

//             {/* Protected Routes - With Layout */}
//             <Route
//               path="/"
//               element={
//                 <ProtectedRoute>
//                   <DashboardLayout />
//                 </ProtectedRoute>
//               }
//             >
//               <Route index element={<Dashboard />} />
//               <Route path="jobs" element={<JobListings />} />
//               <Route path="candidates" element={<Candidates />} />
//               <Route path="messages" element={<Messages />} />
//               <Route path="profile" element={<Profile />} />
//               <Route
//                 path="companies"
//                 element={<Placeholder title="Companies" icon={TbBuilding} />}
//               />
//               <Route
//                 path="applications"
//                 element={<Placeholder title="Applications" icon={TbFileText} />}
//               />
//               <Route
//                 path="interviews"
//                 element={
//                   <Placeholder title="Interviews" icon={TbCalendarEvent} />
//                 }
//               />
//               <Route
//                 path="settings"
//                 element={<Placeholder title="Settings" icon={TbSettings} />}
//               />
//               <Route
//                 path="reports"
//                 element={<Placeholder title="Reports" icon={TbChartBar} />}
//               />
//             <Route path="job-post" element={<JobPost />} />
//             </Route>

//           </Routes>
//           {/* Show MessageToggle only when authenticated */}
//           <MessageToggleWrapper />
//         </AuthProvider>
//       </ToastProvider>
//     </ThemeProvider>
//   );
// }

import { Routes, Route, Navigate } from "react-router-dom";
import {
  TbBuilding,
  TbFileText,
  TbCalendarEvent,
  TbSettings,
  TbChartBar,
  TbUser,
} from "react-icons/tb";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Messages from "./pages/Messages";
import Placeholder from "./pages/Placeholder";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider, ProtectedRoute, useAuth } from "./context/AuthContext";
import MessageToggle from "./components/ui/MessageToggle";

import JobPost from "./pages/JobPost/JobPost";
import JobListings from "./pages/JobListing/JobListings";
import JobApplicants from "./pages/JobListing/JobApplicants"; // Add this import
import ApplicantDetails from "./pages/JobListing/ApplicantDetails";
import CommentSection from "./pages/JobListing/CommentSection";
import JobEdit from "./pages/JobListing/JobEdit";

// Wrapper to conditionally show MessageToggle
function MessageToggleWrapper() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return <MessageToggle />;
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Auth Routes - No Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes - With Layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="jobs" element={<JobListings />} />
              <Route
                path="jobs/:id/applicants"
                element={<JobApplicants />}
              />{" "}
              {/* Add this route */}
              <Route path="candidates" element={<Candidates />} />
              <Route path="messages" element={<Messages />} />
              <Route path="profile" element={<Profile />} />
              <Route
                path="companies"
                element={<Placeholder title="Companies" icon={TbBuilding} />}
              />
              <Route
                path="applications"
                element={<Placeholder title="Applications" icon={TbFileText} />}
              />
              <Route
                path="interviews"
                element={
                  <Placeholder title="Interviews" icon={TbCalendarEvent} />
                }
              />
              <Route
                path="settings"
                element={<Placeholder title="Settings" icon={TbSettings} />}
              />
              <Route
                path="reports"
                element={<Placeholder title="Reports" icon={TbChartBar} />}
              />
              <Route path="job-post" element={<JobPost />} />
              <Route path="*" element={<Navigate to="/" replace />} />

              <Route path="/jobs/:jobId/applicants/:candidateId" element={<ApplicantDetails />} />

              <Route path="/jobs/:jobId/applicants/:candidateId/comment/:applicationId" element={<CommentSection />} />

               <Route path="/jobs/:id/edit" element={<JobEdit />} />
            </Route>

          </Routes>
          {/* Show MessageToggle only when authenticated */}
          <MessageToggleWrapper />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
