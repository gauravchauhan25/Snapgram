import React, { createContext, useContext, useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./_root/Home";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import Search from "./components/Search";
import Notification from "./components/Notification";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Messages from "./components/Messages";
import Reels from "./components/Reels";
import auth from "./services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initial state is null for loading

  useEffect(() => {
    const checkAuth = async () => {
      const session = await auth.isLoggedIn();
      setIsAuthenticated(session);
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={isAuthenticated}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export default function App() {
  const isAuthenticated = useAuth();

  // Show loading indicator during initial auth check
  if (isAuthenticated === null) {
    return (
      <div className="center-container">
        <img
          src="https://cdn-icons-png.flaticon.com/128/185/185985.png"
          alt="Loading"
        />
      </div>
    );
  }

  return (
    <Routes>
      {/* Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route
          path="/sign-in"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <SigninForm />
          }
        />
        <Route
          path="/sign-up"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <SignupForm />
          }
        />
      </Route>

      {/* Root Layout and Protected Routes */}
      <Route element={<RootLayout />}>
        <Route
          index
          element={
            isAuthenticated ? <Home /> : <Navigate to="/sign-in" replace />
          }
        />
        <Route
          path="/Home"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/sign-in" replace />
          }
        />
        <Route
          path="/Search"
          element={
            isAuthenticated ? <Search /> : <Navigate to="/sign-in" replace />
          }
        />
        <Route
          path="/Notification"
          element={
            isAuthenticated ? (
              <Notification />
            ) : (
              <Navigate to="/sign-in" replace />
            )
          }
        />
        <Route
          path="/Messages"
          element={
            isAuthenticated ? <Messages /> : <Navigate to="/sign-in" replace />
          }
        />
        <Route
          path="/Settings"
          element={
            isAuthenticated ? <Settings /> : <Navigate to="/sign-in" replace />
          }
        />
        <Route
          path="/Reels"
          element={
            isAuthenticated ? <Reels /> : <Navigate to="/sign-in" replace />
          }
        />
        <Route
          path="/Profile"
          element={
            isAuthenticated ? <Profile /> : <Navigate to="/sign-in" replace />
          }
        />
      </Route>
    </Routes>
  );
}
