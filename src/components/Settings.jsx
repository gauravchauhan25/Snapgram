import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "../page-styles/Settings.css";
import api from "../services/appwrite";
import { useThemeContext } from "../context/ThemeContext";

export default function Settings() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [language, setLanguage] = useState("English");

  const location = useLocation();
  const navigate = useNavigate();

  const {isLightTheme, setIsLightTheme , handleThemeToggle} = useThemeContext();

  // const handleThemeToggle = () => {
  //   setIsLightTheme(!isLightTheme);
  //   document.body.classList.toggle("light-theme-variables");
  //   document.body.style.transition = "all 500ms ease";
  // };

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

  const handleSave = () => {
    console.log({
      isPrivate,
      language,
    });
    alert("Settings saved successfully!");
  };

  if (location.pathname === "/Settings/edit-profile" || location.pathname === "/Settings/change-password") {
    return <Outlet />;
  }

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      {/* Account Section */}
      <div className="settings-section">
        <h2>Account</h2>
        <ul>
          <li onClick={() => navigate("edit-profile")}>Edit Profile</li>
          <li onClick={() => navigate("change-password")}>Change Password</li>
        </ul>
      </div>

      {/* Privacy Section */}
      <div className="settings-section">
        <h2>Privacy</h2>
        <div className="settings-option">
          <span>Private Account</span>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
          />
        </div>
        <ul>
          <li>Activity Status</li>
        </ul>
      </div>

      {/* Notifications Section */}
      <div className="settings-section">
        <h2>Notifications</h2>
        <ul>
          <li>Push Notifications</li>
          <li>Email and SMS</li>
        </ul>
      </div>

      {/* General Section */}
      <div className="settings-section">
        <h2>General</h2>
        <ul>
          <li>Language</li>
          <li onClick={handleThemeToggle}>{` ${
            isLightTheme ? "Light Theme Mode" : "Dark Theme Mode"
          }`}</li>
          <li>Help Center</li>
          <li>About</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      {/* Save Button */}
      <div className="settings-save">
        <button>Save Settings</button>
      </div>
    </div>
  );
}
