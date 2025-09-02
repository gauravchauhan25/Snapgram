import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "../page-styles/Settings.css";
import "../page-styles/CreatePost.css";
import api from "../services/appwrite";
import { useThemeContext } from "../context/ThemeContext";
import { logoutIcon } from "../assets/categories";
import {
  Activity,
  Bell,
  EyeOff,
  HelpCircle,
  Info,
  KeyRound,
  Languages,
  Mail,
  Moon,
  Sun,
  UserCog,
} from "lucide-react";

export default function Settings() {
  const { isLightTheme, setIsLightTheme, handleThemeToggle } =
    useThemeContext();
  const [isPrivate, setIsPrivate] = useState(false);
  const [language, setLanguage] = useState("English");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Settings";
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const isLogout = await api.logout();
      if (isLogout) {
        window.location.reload();
        navigate("/sign-in");
      } else {
        console.log("Error logging out!");
      }
    } catch (error) {
      console.log("Logout failed:", error.message);
    }
  };

  if (
    location.pathname === "/Settings/edit-profile" ||
    location.pathname === "/Settings/change-password"
  ) {
    return <Outlet />;
  }

  return (
    <div className="settings-container">
      <h1 className="title">Settings</h1>

      {/* Account Section */}
      <div className="settings-section">
        <h2>Account</h2>
        <ul>
          <li
            className="flex items-center gap-2"
            onClick={() => navigate("edit-profile")}
          >
            <UserCog />
            Edit Profile
          </li>
          <li
            className="flex items-center gap-2"
            onClick={() => navigate("change-password")}
          >
            {" "}
            <KeyRound />
            Change Password
          </li>
        </ul>
      </div>

      {/* Privacy Section */}
      <div className="settings-section">
        <h2>Privacy</h2>
        <div className="settings-option">
          <span className="flex items-center gap-2">
            <EyeOff />
            Private Account
          </span>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
          />
        </div>
        <ul>
          <li className="flex items-center gap-2">
            <Activity />
            Activity Status
          </li>
        </ul>
      </div>

      {/* Notifications Section */}
      <div className="settings-section">
        <h2>Notifications</h2>
        <ul>
          <li className="flex items-center gap-2">
            <Bell />
            Push Notifications
          </li>
          <li className="flex items-center gap-2">
            <Mail />
            Email and SMS
          </li>
        </ul>
      </div>

      {/* General Section */}
      <div className="settings-section">
        <h2>General</h2>
        <ul>
          <li className="flex items-center gap-2">
            <Languages />
            Language
          </li>
          <li
            className="flex items-center gap-2"
            onClick={handleThemeToggle}
          >{isLightTheme ? <Sun /> : <Moon />} {` ${isLightTheme ? "Light Theme Mode" : "Dark Theme Mode"}`}</li>
          <li
            className="flex items-center gap-2"
            onClick={() => navigate("/help-center")}
          >
            <HelpCircle />
            Help Center
          </li>
          <li
            className="flex items-center gap-2"
            onClick={() => navigate("/about")}
          >
            <Info />
            About
          </li>
          <li onClick={handleLogout} className="flex items-center gap-2">
            {logoutIcon.icon} Logout
          </li>
        </ul>
      </div>
    </div>
  );
}
