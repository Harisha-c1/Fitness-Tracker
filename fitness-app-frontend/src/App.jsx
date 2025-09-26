
import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "react-oauth2-code-pkce";

import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/DashBoard";
import ActivitiesPage from "./components/ActivityList";
import AICoach from "./components/AiAssistan";
import ActivityForm from "./components/ActivityForm";
import ActivityDetail from "./components/ActivityDetail";

// ----------------------
// ProtectedRoute Component
// ----------------------
function ProtectedRoute({ children }) {
  const { token, loginInProgress, logIn, expiresAt } = useContext(AuthContext);
  const location = useLocation();

  const isExpired = expiresAt && Date.now() > expiresAt * 1000;

  useEffect(() => {
    if (!token || isExpired) {
      logIn(); 
    }
  }, [token, isExpired, logIn]);

  if (loginInProgress) {
    return <p>Checking login...</p>;
  }

  if (!token || isExpired) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

// ----------------------
// App Component
// ----------------------
export default function App() {
  return (
    <>
   
      <Navbar />

      {/* Routes */}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
             path="/activities/:id"
               element={
               <ProtectedRoute>
                 <ActivityDetail />
                 </ProtectedRoute>
                          }
                   />

        <Route
          path="/activities"
          element={
            <ProtectedRoute>
              <ActivitiesPage />
            </ProtectedRoute>
          }
        />
            <Route
             path="/activity-form"
                element={
                 <ProtectedRoute>
                    <ActivityForm />
                     </ProtectedRoute>
                  }
                />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AICoach />
            </ProtectedRoute>
          }
        />


        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

