import React, { createContext, useContext, useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigation } from "react-router-dom";
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
import api from "./services/appwrite";
import CreatePost from "./components/CreatePost";
import EditProfile from "./components/EditProfile";
import Details from "./components/Details";
import { useUserContext } from "./context/AuthContext";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useUserContext();
  return isAuthenticated ? element : <Navigate to="/sign-in" replace />;
};

export default function App() {
  const { isAuthenticated } = useUserContext();

  return (
    <>
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

        {/* Protected Routes */}
        <Route element={<RootLayout />}>
          <Route index element={<ProtectedRoute element={<Home />} />} />
          <Route path="/Home" element={<ProtectedRoute element={<Home />} />} />
          <Route
            path="/Search"
            element={<ProtectedRoute element={<Search />} />}
          />
          <Route
            path="/Notification"
            element={<ProtectedRoute element={<Notification />} />}
          />
          <Route
            path="/Messages"
            element={<ProtectedRoute element={<Messages />} />}
          />
          <Route
            path="/Settings"
            element={<ProtectedRoute element={<Settings />} />}
          />
          <Route
            path="/Reels"
            element={<ProtectedRoute element={<Reels />} />}
          />

           <Route path="/Profile" element={<ProtectedRoute element={<Profile />} />}>
               <Route path="edit-profile" element={<EditProfile />} />
            </Route>

          <Route
            path="/Create"
            element={<ProtectedRoute element={<CreatePost />} />}
          />
          <Route
            path="/enter-details"
            element={<ProtectedRoute element={<Details />} />}
          />
        </Route>
      </Routes>
    </>
  );
}
