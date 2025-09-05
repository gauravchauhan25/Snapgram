import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./_root/Home";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import Search from "./pages/Search";
import Notification from "./pages/Notification";
import Reels from "./pages/Reels";
import Messages from "./pages/Messages";
import CreatePost from "./pages/CreatePost";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import UsersProfile from "./pages/UsersProfile";
import UserNotFound from "./pages/UserNotFound";
import About from "./pages/About";
import ProgressBar from "./components/ProgressBar";
import api from "./services/appwrite";
import { useAuthContext } from "./context/AuthContext";
import HelpCenter from "./pages/HelpCenter";
import ContactSupport from "./pages/ContactSupport";
import RequestFeature from "./pages/RequestFeature";
import ReportBug from "./pages/ReportBug";
import { Toaster } from "react-hot-toast";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? element : <Navigate to="/sign-in" replace />;
};

export default function App() {
  const { isAuthenticated } = useAuthContext();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.getAccount().then(setUser);
  }, []);

  return (
    <>
      <ProgressBar />
      <Toaster />
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
            path="/Create"
            element={<ProtectedRoute element={<CreatePost />} />}
          />
          <Route
            path="/Messages"
            element={<ProtectedRoute element={<Messages />} />}
          />
          <Route
            path="/Settings"
            element={<ProtectedRoute element={<Settings />} />}
          >
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          <Route
            path="/Reels"
            element={<ProtectedRoute element={<Reels />} />}
          />
          <Route
            path="/Profile"
            element={<ProtectedRoute element={<Profile />} />}
          >
            <Route path="edit-profile" element={<EditProfile />} />
          </Route>

          <Route
            path="/:username"
            element={<ProtectedRoute element={<UsersProfile />} />}
          />
          <Route
            path="/user-not-found"
            element={<ProtectedRoute element={<UserNotFound />} />}
          />
        </Route>

        <Route path="/about" element={<About /> } />
        <Route path="/help-center" element={<HelpCenter /> } />
        <Route path="/contact-support" element={<ContactSupport /> } />
        <Route path="/request-feature" element={<RequestFeature /> } />
        <Route path="/report-bug" element={<ReportBug /> } />
      </Routes>
    </>
  );
}
